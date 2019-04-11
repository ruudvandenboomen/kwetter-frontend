import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/models/user';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { UsersModalComponent } from '../users-modal/users-modal.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild(UsersModalComponent) child;

  username: string;
  user: User;
  isFollowing: boolean;
  type: string;

  constructor(private userService: UserService, private authService: AuthService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.initUserData();
  }

  initUserData() {
    this.route.paramMap.subscribe(params => {
      if (params.get("username")) {
        this.username = params.get("username")
        if (this.authService.isLoggedIn() && localStorage.getItem("username") != null) {
          this.userService.getProfile(this.username).subscribe(data => {
            this.user = data;
          })
          this.following();
        } else {
          this.router.navigateByUrl('/login');
        }
      }
    });
  }

  follow() {
    this.userService.follow(localStorage.getItem("username"), this.username).subscribe(data => {
    }, error => { })
    this.isFollowing = true;
  }

  popup(type: string) {
    if (type == 'following') {
      this.child.initFollowing();
    } else if (type == 'followers') {
      this.child.initFollowers();
    }
  }

  showFollow(): boolean {
    return this.username != localStorage.getItem("username")
  }

  following() {
    this.userService.getFollowers(this.username).subscribe(data => {
      this.isFollowing = data.indexOf(localStorage.getItem("username")) > -1
    }, error => { })
    this.isFollowing = false;
  }

}
