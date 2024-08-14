import { Component, ViewChild } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { Sidebar } from 'primeng/sidebar';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'sidebar-headless-demo',
    templateUrl: './home.component.html',
    standalone: true,
    imports: [SidebarModule, ButtonModule, RippleModule, AvatarModule, StyleClassModule,CommonModule]
})
export class HomeComponent {
    @ViewChild('sidebarRef') sidebarRef!: Sidebar;

    closeCallback(e:any): void {
        this.sidebarRef.close(e);
    }

    sidebarVisible: boolean = false;
}