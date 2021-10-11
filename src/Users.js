import React from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsFillTrashFill } from "react-icons/bs";
import { BsFillPersonFill } from "react-icons/bs";
import { Table, Button, Form, Modal } from "react-bootstrap";


class Users extends React.Component {
    constructor() {
        super();
        this.state = {
            users: [],
            fist_name: "",
            last_name: "",
            username: "",
            email: "",
            _id: "",
            pwd: "",
            show: false,
        };
    }

    // handling modal events
    handleShow = () => {
        this.setState({
            show: true
        })
    }

    handleClose = () => {
        this.setState({
            show: false
        })
    }

    componentDidMount = () => this.getUsers();

    getUsers = async () => {
        // API Call to server and get all users
        try {
            const { data } = await axios.get("http://3.6.93.159:7883/machstatz/get_all_users");
            this.setState({ users: data });
            console.log(this.state.users)
        } catch (err) {
            console.error(err);
        }
    };

    createUser = async () => {
        // API Call to server and add new user
        try {
            const { fist_name, last_name, username, email, pwd } = this.state;
            const { data } = await axios.post("http://3.6.93.159:7883/machstatz/add_new_user", {
                fist_name, last_name, username, email, pwd
            });
            const users = [...this.state.users];
            users.push(data);
            this.setState({ users, fist_name: "", last_name: "", username: "", email: "", pwd: "" });
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    };

    deleteUser = async (userId) => {
        // API Call to server and delete a user
        try {
            await axios.delete("http://3.6.93.159:7883/machstatz/delete_existing_user");

            let users = [...this.state.users];
            users = users.filter(({ _id }) => _id !== userId);

            this.setState({ users });
        } catch (err) {
            console.error(err);
        }
    };

    selectUser = (user) => this.setState({ ...user });

    handleChange = ({ target: { name, value } }) => {
        this.setState({ [name]: value });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted...");
        this.createUser();
    };

    render() {
        const { show } = this.state
        return (
            <div className='m-3 pl-5 pr-5' >
                <Button variant="primary" size="sm" onClick={this.handleShow}>Add New User &nbsp;<BsFillPersonFill /></Button>
                <br />
                <br />

                {/* Modal for adding new user */}
                <Modal fade={false} animation={false} show={show} onHide={this.handleClose} size="xl">
                    <Modal.Header>
                        <Modal.Title >Add New User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group className="mb-3" controlId="formUserID">
                                <Form.Label column sm="2"> First Name  &nbsp;</Form.Label>
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    className="mx-auto"
                                    name="first_name"
                                    value={this.state.first_name}
                                    onChange={this.handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formTitle">
                                <Form.Label column sm="2"> Last Name  &nbsp;</Form.Label>
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    className="mx-auto"
                                    name="last_name"
                                    value={this.state.last_name}
                                    onChange={this.handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formTitle">
                                <Form.Label column sm="2"> Username  &nbsp;</Form.Label>
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    className="mx-auto"
                                    name="username"
                                    value={this.state.username}
                                    onChange={this.handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBody">
                                <Form.Label column sm="2"> Email  &nbsp;</Form.Label>
                                <Form.Control
                                    type="email"
                                    size="sm"
                                    className="mx-auto"
                                    name="email"
                                    value={this.state.email}
                                    onChange={this.handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBody">
                                <Form.Label column sm="2"> Password  &nbsp;</Form.Label>
                                <Form.Control
                                    type="password"
                                    size="sm"
                                    className="mx-auto"
                                    name="pwd"
                                    value={this.state.pwd}
                                    onChange={this.handleChange}
                                    required
                                />
                            </Form.Group>
                            <Button variant="success" type="submit">
                                Submit
                            </Button>
                            <br></br>
                            <br></br>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* displaying fetched user data */}
                <Table hover size="sm">
                    <thead>
                        <tr>
                            <th className="text-center">Username</th>
                            <th className="text-center">Email</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.users.map((user) => {
                            return (
                                <tr key={user._id}>
                                    <td className="text-center">{user.username}</td>
                                    <td className="text-center">{user.email}</td>
                                    <td className="text-center">
                                        <Button variant="light" size="sm" onClick={() => this.deleteUser(user._id)}><BsFillTrashFill /></Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
        );
    }
};



export default Users;
