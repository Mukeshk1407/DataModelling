import { Component, OnInit } from '@angular/core';
import { ScreenService } from '../services/screen.service';
import { Screen } from '../models/Screen';
import { ToastrService } from '../services/ToastrService';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-screen-management',
  templateUrl: './screen-management.component.html',
  styleUrls: ['./screen-management.component.css'],
})
export class ScreenManagementComponent implements OnInit {
  screens: Screen[] = [];
  editingScreen: Screen | null = null;

  constructor(
    private screenService: ScreenService,
    private toastrService: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getScreens();
  }

  getScreens(): void {
    this.screenService.getScreens().subscribe(
      (data: any) => {
        if (data.isSuccess) {
          this.screens = data.result.result;
        } else {
          this.toastrService.showError('Failed to fetch screens');
        }
      },
      (error) => {
        console.error('Error fetching screens:', error);
        this.toastrService.showError('Error fetching screens');
      }
    );
  }

  editScreen(screen: Screen): void {
    this.editingScreen = { ...screen }; // Copy the selected screen for editing
  }

  saveEditedScreen(): void {
    if (this.editingScreen) {
      this.screenService
        .editScreen(this.editingScreen.id, this.editingScreen)
        .subscribe(
          (response) => {
            if (response.isSuccess) {
              this.toastrService.showSuccess('Screen updated successfully');
              this.getScreens(); // Refresh the screen list after editing
            } else {
              this.toastrService.showError('Failed to update screen');
            }
          },
          (error) => {
            console.error('Error updating screen:', error);
            this.toastrService.showError('Error updating screen');
          }
        );
      this.editingScreen = null; // Reset editingScreen
    }
  }

  cancelEdit(): void {
    this.editingScreen = null; // Clear editing state
  }

  closePopup(): void {
    const dialogRef = this.dialog.closeAll();
  }
}
