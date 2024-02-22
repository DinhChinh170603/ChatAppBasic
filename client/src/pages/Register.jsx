import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";

const Register = () => {
  const { registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading } =
    useContext(AuthContext);

  return (
    <Form onSubmit={registerUser}>
      <Row className="h-100 justify-content-center pt-[10%]">
        <Col xs={6}>
          <Stack gap={3}>
            <h2>Register</h2>

            <Form.Group controlId="formBasicName">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                onChange={(e) =>
                  updateRegisterInfo({ ...registerInfo, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) =>
                  updateRegisterInfo({ ...registerInfo, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                onChange={(e) =>
                  updateRegisterInfo({
                    ...registerInfo,
                    password: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {isRegisterLoading ? "Creating..." : "Register"}
            </Button>
            {registerError?.error && (
              <Alert variant="danger">
                <p>{registerError?.message}</p>
              </Alert>
            )}
          </Stack>
        </Col>
      </Row>
    </Form>
  );
};

export default Register;
