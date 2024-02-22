import { useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";


const Login = () => {
  const { login, loginInfo, updateLoginInfo, loginError, isLoginLoading } =
    useContext(AuthContext);

  return (
    <Form onSubmit={login}>
      <Row className="h-100 justify-content-center pt-[10%]">
        <Col xs={6}>
          <Stack gap={3}>
            <h2>Login</h2>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) =>
                  updateLoginInfo({ ...loginInfo, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                onChange={(e) =>
                  updateLoginInfo({ ...loginInfo, password: e.target.value })
                }
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {isLoginLoading ? "Logging in..." : "Login"}
            </Button>
            {loginError?.error && (
              <Alert variant="danger">
                <p>{loginError?.message}</p>{" "}
              </Alert>
            )}
          </Stack>
        </Col>
      </Row>
    </Form>
  );
};

export default Login;
