import React from 'react'
import { useForm } from '@mantine/form';
import { Card, Divider, Stack, TextInput, Button, Title, Anchor, Text, Group } from '@mantine/core';
import { addDoc, collection, getDocs, where, query } from "firebase/firestore";
import { fireDb } from '../firebaseConfig';
import cryptojs from "crypto-js";
import { notifications } from '@mantine/notifications';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import categories from '../objects/categories';

function Register() {
    const dispatch = useDispatch();
    const registerForm = useForm({
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
            // checking if all inputs are filled
            if (registerForm.values.name === "" || registerForm.values.email === "" || registerForm.values.password === "") {
                notifications.show({
                    title: "Please fill all the fields.",
                    message: "Can't create User without data :(",
                    color: "red",
                });
            } else { // if all fields are full
                // checking if user already exists based on email
                const qry = query(
                    collection(fireDb, "users"),
                    where("email", "==", registerForm.values.email)
                );
                const existingUsers = await getDocs(qry);

                if (existingUsers.size > 0) {
                    console.log(existingUsers);
                    notifications.show({
                        title: "You already exist!",
                        message: "Congratulations... Try to Login.",
                        color: "red",
                    });
                } else { // if user doesn't exist already
                    // encrypt password
                    const encryptedPassword = cryptojs.AES.encrypt(
                        registerForm.values.password,
                        "expensetrackertmh"
                    ).toString();

                    // add Form entry to the DB
                    const response = await addDoc(
                        collection(fireDb, "users"),
                        {
                            ...registerForm.values,
                            password: encryptedPassword,
                        }
                    );
                    if (response.id) { //response.id will always be available cause of field check above
                        // add categories
                        await categories.forEach(function(category) {
                        addDoc(
                            collection(
                              fireDb,
                              `users/${response.id}/categories`
                            ),
                            category
                          );
                        });

                        notifications.show({
                            title: "User created!",
                            message: "Welcome :)",
                            color: "green",
                        });
                    } else {
                        notifications.show({
                            title: "User creation failed! :(",
                            message: "nope",
                            color: "red",
                        });
                    }
                }
            }
            dispatch(HideLoading())
        } catch (error) {
            dispatch(HideLoading())
            notifications.show({
                title: "Something went horribly wrong. :( You might wanna reconsider your life choices.",
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
                <Title order={1} mb={5}>REGISTER</Title>
                <Text
                    size='xl'
                    fw={900}
                    variant="gradient"
                    gradient={{ from: 'rgba(71, 82, 43, 1)', to: 'green', deg: 90 }}
                >
                    FineAnts
                </Text>
            </Group>
            <Divider
                variant="dashed"
                color='grey'
            />
            <form action="" onSubmit={onSubmit}>
                <Stack mt={25}>
                    <TextInput
                        label="Name"
                        placeholder="Enter your name"
                        name="name"
                        {...registerForm.getInputProps("name")}
                        mb={10}
                    />
                    <TextInput
                        label="Email"
                        placeholder="Enter your email"
                        type='email'
                        name="email"
                        {...registerForm.getInputProps("email")}
                    />
                    <TextInput
                        label="Password"
                        placeholder="Set your password"
                        type="password"
                        name="password"
                        {...registerForm.getInputProps("password")}
                    />
                    <Button
                        type='submit'
                        variant="gradient"
                        gradient={{ from: 'lime', to: 'teal', deg: 134 }}
                        autoContrast
                    >
                        Register
                    </Button>
                    <Text>Already have an account?
                        <Anchor
                            href="/login"
                            variant='gradient'
                            gradient={{ from: 'pink', to: 'yellow' }}
                            fw={500} fz="lg"
                            underline='hover'
                        > Login
                        </Anchor> 👈
                    </Text>
                </Stack>
            </form>
        </Card>
    </div>;
}

export default Register