const { log } = require("util");
const { db } = require("../../../config/connection");
const CustomError = require("../../../utils/CustomError");
const { getUserById } = require("../../users/userRepository");

const { Thread, User,Forum } = db;

exports.createThread = async (threadData, attachments, forum) => {
  const transaction = await db.connectDB.transaction();
  try {
    // Extract attachment filenames
    const attachmentFilenames = attachments.map(
      (attachment) => attachment.filename
    );

    // Create the thread
    const newThread = await Thread.create(
      {
        title: threadData.title,
        content: threadData.content,
        attachments: JSON.stringify(attachmentFilenames),
        forumId: forum.id,
        createdBy: threadData.userId,
      },
      { transaction }
    );

    // Generate URLs for the attachments
    const attachmentUrls = attachmentFilenames.map((filename) => {
      return `${process.env.BASE_URL}/uploads/${filename}`;
    });

    const user = await getUserById(newThread.createdBy);
    const authorData = { firstname: user.firstname, lastname: user.lastname };

    const dataToSend = {
      ...newThread.toJSON(),
      attachmentUrls,
      User: authorData,
    };

    await transaction.commit();
    return dataToSend;
  } catch (error) {
    console.log(error);

    await transaction.rollback();
    throw new CustomError(
      "Could not create thread. Please try again later.",
      400
    );
  }
};

exports.getThreadById = async (id) => {
  const transaction = await db.connectDB.transaction(); // Start the transaction
  try {
    // Fetch the thread by ID within the transaction
    const thread = await Thread.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["id", "firstname", "lastname", "photo"],
        },
        {
          model: Forum, // Include the Forum model
          attributes: ["id", "name", "description"], // Specify the fields you want from the Forum table
        },
      ],
      transaction,
    });

    if (!thread) {
      throw new CustomError("Thread not found", 404);
    }

    // Process the thread to include attachment URLs
    const attachmentFilenames = JSON.parse(thread.attachments || "[]");
    const attachmentUrls = attachmentFilenames.map((filename) => {
      return `${process.env.BASE_URL}/uploads/${filename}`;
    });

    // Get author data
    const authorData = {
      firstname: thread.User.firstname,
      lastname: thread.User.lastname,
      photo: thread.User.photo,
    };

    // Return the thread data with the attachment URLs and author data
    const threadWithAttachments = {
      ...thread.toJSON(),
      attachmentUrls,
      User: authorData,
    };

    await transaction.commit(); // Commit the transaction if all goes well
    return threadWithAttachments;
  } catch (error) {
    await transaction.rollback(); // Rollback the transaction in case of an error
    console.log(error);
    throw new CustomError(
      "Could not fetch the thread. Please try again later.",
      400
    );
  }
};

exports.getAllThreads = async (forum) => {
  const transaction = await db.connectDB.transaction(); // Start the transaction
  try {
    // Fetch threads for the given forum within the transaction
    const threads = await Thread.findAll({
      where: { forumId: forum.id },
      include: [
        {
          model: User,
          attributes: ["id", "firstname", "lastname", "email", "photo"],
        },
      ],
      transaction,
    });

    // Process the threads to include attachment URLs
    const threadsWithAttachmentUrls = threads.map((thread) => {
      const attachmentFilenames = JSON.parse(thread.attachments || "[]");
      const attachmentUrls = attachmentFilenames.map((filename) => {
        return `${process.env.BASE_URL}/uploads/${filename}`;
      });

      // Get author data
      const authorData = {
        firstname: thread.User.firstname,
        lastname: thread.User.lastname,
        email: thread.User.email,
        photo: thread.User.photo,
      };

      // Return the thread data with the attachment URLs and author data
      return {
        ...thread.toJSON(),
        attachmentUrls,
        User: authorData,
      };
    });

    await transaction.commit(); // Commit the transaction if all goes well
    return threadsWithAttachmentUrls;
  } catch (error) {
    await transaction.rollback(); // Rollback the transaction in case of an error
    console.log(error);
    throw new CustomError(
      "Could not fetch threads. Please try again later.",
      400
    );
  }
};

exports.updateThread = async (threadId, threadData) => {
  const thread = await Thread.findByPk(threadId);
  return await thread.update(threadData);
};

exports.deleteThread = async (threadId) => {
  const thread = await Thread.findByPk(id);
  return await thread.destroy();
};
