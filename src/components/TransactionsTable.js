import { Group, Table, stylesToString } from '@mantine/core'
import React from 'react'
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import { deleteDoc, doc } from 'firebase/firestore';
import { fireDb } from '../firebaseConfig';
import { notifications } from '@mantine/notifications';

// function to make the first letter of a word upperCase
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function TransactionsTable({
    transactions,
    setSelectedTransaction,
    setFormMode,
    setShowForm,
    getData
 }) {
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem("user"));
    const deleteTransaction = async (id) => {
        try {
            dispatch(ShowLoading());
            await deleteDoc(doc(fireDb, `users/${user.id}/transactions`, id));
            dispatch(HideLoading());
            getData();
            notifications.show({
              title: "Transaction deleted!",
              message: ":o",
              color: "yellow",
            });
        } catch (error) {
            dispatch(HideLoading());
            notifications.show({
                title: "Error deleting Transaction.",
                message: ":/",
                color: "red",
              });
        }
    };

    // Dateformatter
    const dateFormatter = new Intl.DateTimeFormat('de-DE', {dateStyle: 'medium'});
    const numberFormatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR'});
    // define the rows for the table
    const getRows = transactions.map((transaction) => (
        <Table.Tr key={transaction.id}>
            <Table.Td>{dateFormatter.format(transaction.date.toDate())}</Table.Td>
            <Table.Td>{capitalizeFirstLetter(transaction.type)}</Table.Td>
            <Table.Td className='table-right'>{numberFormatter.format(transaction.amount)}</Table.Td>
            <Table.Td>{transaction.name}</Table.Td>
            <Table.Td>{capitalizeFirstLetter(transaction.category)}</Table.Td>
            <Table.Td>{transaction.reference}</Table.Td>
            <Table.Td>
                <Group>
                    <i class="ri-edit-line"
                        onClick={() => {
                            setSelectedTransaction(transaction)
                            setFormMode("edit")
                            setShowForm(true)
                        }}
                    ></i>
                    <i class="ri-delete-bin-line"
                        onClick={() => {
                            deleteTransaction(transaction.id);
                        }}
                    ></i>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Table
            verticalSpacing='md'
            striped
            highlightOnHover
            stickyHeader
            stickyHeaderOffset={60}
            withColumnBorders
        >
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Type</Table.Th>
                    <Table.Th className='table-right'>Amount</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Category</Table.Th>
                    <Table.Th>Reference</Table.Th>
                    <Table.Th>Actions</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{getRows}</Table.Tbody>
        </Table>
    )
}

export default TransactionsTable