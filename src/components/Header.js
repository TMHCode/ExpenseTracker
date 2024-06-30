import { Card, Group, Text } from '@mantine/core'
import React from 'react'

function Header() {
    const user = JSON.parse(localStorage.getItem('user'))
    return (
        <div>
            <Card
                shadow='md'
                withBorder
                p={20}
            >
                <div className='flex justify-between'>
                    <Text
                        size='xl'
                        fw={900}
                        variant="gradient"
                        gradient={{ from: 'rgba(71, 82, 43, 1)', to: 'green', deg: 90 }}
                    >
                        FineAnts
                    </Text>
                    <Group className='flex items-center'>
                        <Text size='xl' fw={700}>{user?.name}</Text>
                        <i
                            className="ri-logout-circle-r-line"
                            onClick={() => {
                                localStorage.removeItem("user");
                                window.location.reload();
                            }}
                        ></i>
                    </Group>
                </div>
            </Card>
        </div>
    )
}

export default Header