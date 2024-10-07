// role-management.component.ts

import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RoleService } from '../services/role.service';
import { Role } from '../models/Role';
import { ToastrService } from '../services/ToastrService';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css'],
})
export class RoleManagementComponent {
  roles: Role[] = [];
  newRole: string = '';
  editingRole: Role | null = null;

  constructor(
    private dialog: MatDialog,
    private roleService: RoleService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getrole();
  }

  // removeRole(roleId: number): void {
  //   this.roleService.removeRole(roleId);
  // }

  editRole(editedRole: Role): void {
    this.editingRole = { ...editedRole }; // Set the editingRole property
  }

  addRole(roleName: string): void {
    if (roleName.trim() !== '') {
      const newRole: Role = {
        roleName: roleName,
        id: 0,
      };
      this.roleService.addRole(newRole).subscribe(
        (response) => {
          if (response.isSuccess) {
            this.toastrService.showSuccess('New Role Created Successfully');
            this.getrole();
            this.newRole = '';
          } else {
            this.toastrService.showError(response.errorMessage[0]);
          }
        },
        (error) => {
          this.toastrService.showError('Role name cannot be empty');
        }
      );
    } else {
      this.toastrService.showError('Role name cannot be empty');
    }
  }

  // getrole() {
  //   this.roleService.getRoles().subscribe(
  //     (data: any) => {
  //       this.roles = data.result.result;
  //     },
  //     (error) => {}
  //   );
  // }
  getrole() {
    this.roleService.getRoles().subscribe({
      next: (data: any) => {
        this.roles = data.result.result;
      },
      error: (error) => {
        console.error('Error fetching roles:', error);
      },
      complete: () => {
        console.log('Role fetching completed');
      },
    });
  }

  saveEditedRole(): void {
    if (this.editingRole !== null && this.editingRole.roleName.trim() !== '') {
      const roleId = this.editingRole.id;
      this.roleService.editRole(roleId, this.editingRole).subscribe(
        (updatedRole) => {
          console.log('Role updated successfully:', updatedRole);
          if (updatedRole.result.isSuccess) {
            this.toastrService.showSuccess('Role updated successfully');
          }
          // Update your local data or take any other actions as needed
        },
        (error) => {
          console.error('Error updating role:', error);
          // Handle the error, show a message, etc.
        }
      );
      this.editingRole = null;
    } else {
      this.toastrService.showError('Role name cannot be empty');
    }
  }

  cancelEditedRole(): void {
    this.editingRole = null;
  }

  closePopup(): void {
    // Implement logic to close the popup when the close icon is clicked
    const dialogRef = this.dialog.closeAll();
  }
}
