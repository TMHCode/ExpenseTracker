import React from 'react'
import { useForm } from '@mantine/form';
import { Card, Divider, Stack, TextInput, Button, Title, Anchor, Text, Group } from '@mantine/core';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { fireDb } from '../firebaseConfig';
import cryptojs from 'crypto-js';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loginForm = useForm({
        initialValues: {
            name: "",
            email: "",
            password: "",
        }
    });

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            dispatch(ShowLoading())
            // checking if email is found
            const qry = query(
                collection(fireDb, "users"),
                where("email", "==", loginForm.values.email)
            );
            const correctUsers = await getDocs(qry);
            if (correctUsers.size > 0) {
                // checking if password if correct
                // decrypt password
                const decryptedPassword = cryptojs.AES.decrypt(
                    correctUsers.docs[0].data().password,
                    "expensetrackertmh"
                ).toString(cryptojs.enc.Utf8);
                // checking password
                if (decryptedPassword === loginForm.values.password) {
                    notifications.show({
                        title: "Login successfull!",
                        message: "yee",
                        color: "green",
                    });
                    const dataToPutInLocalStorage = {
                        name: correctUsers.docs[0].data().name,
                        email: correctUsers.docs[0].data().email,
                        id: correctUsers.docs[0].id,
                    };
                    localStorage.setItem("user", JSON.stringify(dataToPutInLocalStorage));
                    navigate("/");
                } else {
                    notifications.show({
                        title: "Invalid credentials! :(",
                        message: "You shall not pass!",
                        color: "red",
                    });
                }
            } else {
                notifications.show({
                    title: "Email or Password is not correct.",
                    message: "Are you registered?",
                    color: "red",
                });
            }
            dispatch(HideLoading())
        } catch (error) {
            dispatch(HideLoading())
            notifications.show({
                title: "Something went wrong. :(",
                message: "nope",
                color: "red",
            });
        }
    }
    // the page
    return <div className='flex h-screen justify-center items-center'>
        <Card
            style={{
                width: 400,
            }}
            shadow='lg'
            withBorder
        >
            <Group justify='space-between' align='top'>
                <Title order={1} mb={5}>LOGIN</Title>
                <Text
                    size='xl'
                    fw={900}
                    variant="gradient"
                    gradient={{ from: 'rgba(71, 82, 43, 1)', to: 'green', deg: 90 }}
                >
                    ExpenseTracker
                </Text>
            </Group>
            <Divider
                variant="dashed"
                color='grey'
            />
            <form action="" onSubmit={onSubmit}>
                <Stack mt={25}>
                    <TextInput
                        label="Email"
                        placeholder="Enter your email"
                        name="email"
                        {...loginForm.getInputProps("email")}
                    />
                    <TextInput
                        label="Password"
                        placeholder="Set your password"
                        type="password"
                        name="password"
                        {...loginForm.getInputProps("password")}
                    />
                    <Button
                        type='submit'
                        variant="gradient"
                        gradient={{ from: 'teal', to: 'lime', deg: 134 }}
                        autoContrast
                    >
                        Login
                    </Button>
                    <Text>Don't have an account?
                        <Anchor
                            href="/register"
                            variant='gradient'
                            gradient={{ from: 'yellow', to: 'pink' }}
                            fw={500} fz="lg"
                            underline='hover'
                        > Register
                        </Anchor> 👈
                    </Text>
                </Stack>
            </form>
        </Card>
    </div>;
}

export default Login