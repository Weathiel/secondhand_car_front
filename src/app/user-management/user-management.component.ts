import { Component, OnInit, Inject } from '@angular/core';
import { User } from '../user';
import { UserService } from '../services/user.service';
import { first } from 'rxjs/operators';
import { PageEvent, MatTableDataSource } from '@angular/material';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ManagementDialogComponent } from '../management-dialog/management-dialog.component';
import { element } from 'protractor';
import { Offer } from '../offer';
import { AuthenticationService } from '../services/authentication.service';
import { DetailsOrdersDialogComponent } from '../orders-managment/orders-managment.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[];
  displayedColumns: string[] = ['firstName', 'lastName', 'username', 'email', 'details', 'edit', 'delete'];
  pageSize = 10;
  length: number;
  pageSizeOptions: number[] = [ 10, 1, 30 ];
  dataSource: MatTableDataSource<User>;

  constructor(private userService: UserService,
              public dialog: MatDialog) {
    userService.getAll(0, 10).subscribe(data => {
      this.users = data;
      this.dataSource = new MatTableDataSource(this.users);
    });
   }

  ngOnInit() {
    this.userService.getLenght().subscribe((data: number) => {
      this.length = data;
    });
  }


  changePage(event: PageEvent) {
    this.userService.getAll(event.pageIndex, event.pageSize).subscribe(data => {
      // this.users = new Array<User>();
      this.users = data;
      this.dataSource.data = this.users;
    });
  }

  edit(id) {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().pipe(first()).subscribe(role => {
        const user = this.users.find(ele => ele.userId === id);
        switch (role) {
          case 'ROLE_WORKER':
            user.roleId = 2;
            break;
          case 'ROLE_USER':
            user.roleId = 1;
            break;
          case 'ROLE_ADMIN':
            user.roleId = 3;
            break;
          }
        if (role != null && user != null && id != null) {
          this.userService.update(id, user).pipe(first()).subscribe();
        }
      });

  }

  details(username) {
    const dialogRef = this.dialog.open(DetailsUserDialogComponent, {
      width: '500px',
      data: {userUsername: username}
    });
  }

  filter() {
      this.userService.getLenght().subscribe(length => this.userService.getAll(0, length).subscribe(allUsers => {
        const dialogRef = this.dialog.open(FilterUserDialogComponent, {
          width: '500px',
          data: {users: allUsers}
        });
        dialogRef.afterClosed().pipe(first()).subscribe((data: User) => {
          this.userService.filter(data).subscribe((users: User[]) => {
              this.users = users;
              this.dataSource = new MatTableDataSource(this.users);
              this.length = users.length;
          });
        });
      }));

  }

  delete(id) {
    const dialogRef = this.dialog.open(ManagementDialogComponent, {
      width: '350px',
      data: {data: false}
    });

    dialogRef.afterClosed().pipe(first()).subscribe((data: boolean) => {
      if (data === true) { this.userService.delete(id).subscribe();
                           this.dataSource.data = this.dataSource.data.filter(cb => {
        if (cb.userId !== id) {
          return cb;
        }
      });
    }
    });
  }

}

@Component({
  selector: 'app-user-management-dialog',
  templateUrl: 'edit-user-dialog.html',
})
export class EditUserDialogComponent {
  private selectedRole;

  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    private authService: AuthenticationService) {
      this.selectedRole = authService.currentUserValue.role[0];
    }

    onClick(): void {
      this.dialogRef.close(this.selectedRole);
    }
}

@Component({
  selector: 'app-user-management-dialog',
  templateUrl: 'details-user-dialog.html',
})
export class DetailsUserDialogComponent {
  private users: User[];

  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService) {
      this.userService.getUserByUsername(this.data.userUsername).subscribe((user: User) => {
        this.users = [];
        this.users.push(user);
      });
    }

    onClick(): void {
      this.dialogRef.close();
    }
}

@Component({
  selector: 'app-user-filter-dialog',
  templateUrl: 'filter-user-dialog.html',
})
export class FilterUserDialogComponent {
  private username: string;
  private firstname: string;
  private lastname: string;

  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    onClick(): void {
      const userDto = new User();
      userDto.username = this.username;
      userDto.firstName = this.firstname;
      userDto.lastName = this.lastname;

      if (this.username == null) {
        userDto.username = '';
      }
      if (this.firstname == null) {
        userDto.firstName = '';
      }
      if (this.lastname == null) {
        userDto.lastName = '';
      }

      this.dialogRef.close(userDto);
    }
}



