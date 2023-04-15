import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import CameraWithFrame from '../components/CameraWithFrame';
import CameraWithPrevious from '../components/CameraWithPrevious';

function PublicRoutes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <CameraWithFrame
            imageSource={mouthFrame}
            clientLogo={selectedImage}
          ></CameraWithFrame>
        </Route>
        <Route exact path="/camera-with-previous">
          <CameraWithPrevious
            imagePrevious={takenPicture}
            clientLogo={clientLogo}
          ></CameraWithPrevious>
        </Route>
      </Switch>
    </Router>
  );
}

export default PublicRoutes;
