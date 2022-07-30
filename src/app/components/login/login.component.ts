import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import OktaSignIn from '@okta/okta-signin-widget';

import myAppConfig from 'src/app/config/my-app-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignin: any;

  constructor(private oktaAuthService: OktaAuthService) {
    
    this.oktaSignin = new OktaSignIn({
      logo: 'assets/images/logo.png',
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams: {
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
      }
    });

  }

  ngOnInit(): void {
    this.oktaSignin.remove();

    this.oktaSignin.renderEl(
      { el: '#okta-sign-in-widget' }, // Render the element with the given ID: <div id="okta-sign-in-widget"></div>
      
      // 1. The user attempts to log in
      (response: { status: string; }) => {
        // 2. We get a response status
        if (response.status === 'SUCCESS') {
          // 3. If so we'll go ahead and do a sign in with redirect
          this.oktaAuthService.signInWithRedirect();
        }
      },
      // If there was an error during sing-in
      (error: any) => {
        throw error;
      }
    );
  }

}
