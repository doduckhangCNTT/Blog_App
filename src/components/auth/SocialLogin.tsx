import { GoogleLogin, GoogleLoginResponse } from "react-google-login-lite";
import { useDispatch } from "react-redux";
import { facebookLogin, googleLogin } from "../../redux/actions/authAction";

import FacebookLogin, {
  FacebookLoginAuthResponse,
} from "react-facebook-login-lite";

const SocialLogin = () => {
  const dispatch = useDispatch();

  const onSuccess = (googleUser: GoogleLoginResponse) => {
    const id_token = googleUser.getAuthResponse().id_token;
    dispatch(googleLogin(id_token));
  };

  const onFBSuccess = (response: FacebookLoginAuthResponse) => {
    const { accessToken, userID } = response.authResponse;
    dispatch(facebookLogin(accessToken, userID));
  };

  return (
    <>
      <div className="my-2">
        {" "}
        <GoogleLogin
          client_id="926921445898-mu2rdm6f85gj1um9en5oo2eqmuvfgl4i.apps.googleusercontent.com"
          cookiepolicy="single_host_origin"
          onSuccess={onSuccess}
        />
      </div>

      <div className="my-2">
        <FacebookLogin appId="666849017875943" onSuccess={onFBSuccess} />
      </div>
    </>
  );
};

export default SocialLogin;
