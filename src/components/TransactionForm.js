import React, { useEffect } from 'react'
import { useForm } from '@mantine/form';
import { Button, Group, NumberInput, Select, Stack, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { notifications } from '@mantine/notifications';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import { fireDb } from '../firebaseConfig';


function TransactionForm({
  formMode,
  setFormMode,
  setShowForm,
  transactionData,
  getData
}) {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const transactionForm = useForm({
    initialValues: {
      name: '',
      type: '',
      category: '',
      amount: '',
      date: new Date(),
      reference: '',
    },
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (transactionForm.values.name === "" ||
        transactionForm.values.type === "" ||
        transactionForm.values.category === "" ||
        transactionForm.values.amount === "" ||
        transactionForm.values.date === "") {
        notifications.show({
          title: "Missing data! :(",
          message: "Make sure all the fields are filled.",
          color: "red",
        });
      } else {
        dispatch(ShowLoading());
        if (formMode === "add") {
          await addDoc(
            collection(
              fireDb,
              `users/${user.id}/transactions`
            ),
            transactionForm.values
          );
        } else {
          await setDoc(
            doc(fireDb, `users/${user.id}/transactions`, transactionData.id),
            transactionForm.values
          );
        }

        notifications.show({
          title: formMode === "add" ? "Transaction added!" : "Transaction updated!",
          message: ":)",
          color: "green",
        });
        dispatch(HideLoading());
        getData();
        setShowForm(false);
      }
    } catch (error) {
      notifications.show({
        title: "That didn't work.",
        message: formMode === "add" ? "Transaction not added :(" : "Transaction could not be updated :(",
        color: "red",
      });
      dispatch(HideLoading());
    }
  };

  useEffect(() => {
    if (formMode === "edit") {
      transactionForm.setValues(transactionData);
      transactionForm.setFieldValue("date", transactionData.date.toDate());
    }
  }, [transactionData])

  return (
    <div>
      <form action=""
        onSubmit={onSubmit}
      >
        <Stack>
          <TextInput
            name="name"
            label="Name"
            placeholder="Enter Transaction Name"
            {...transactionForm.getInputProps("name")}
            required
          />
          <Group grow>
            <Select
              name="type"
              label="Type"
              placeholder='Select Transaction Type'
              data={[
                { value: "income", label: "Income" },
                { value: "expense", label: "Expense" },
              ]}
              {...transactionForm.getInputProps("type")}
              required
            />
            <Select
              name="category"
              label="Category"
              placeholder='Select Transaction Category'
              data={[
                { value: "food", label: "Food" },
                { value: "transport", label: "Transport" },
                { value: "shopping", label: "Shopping" },
                { value: "entertainment", label: "Entertainment" },
                { value: "health", label: "Health" },
                { value: "education", label: "Education" },
                { value: "salary", label: "Salary" },
                { value: "gifts", label: "Gifts" },
                { value: "other", label: "Other" },
              ]}
              {...transactionForm.getInputProps("category")}
              required
            />
          </Group>
          <Group grow>
            <NumberInput
              name="amount"
              label="Amount"
              suffix='€'
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              decimalSeparator=','
              hideControls
              placeholder='Select Transaction Amount'
              {...transactionForm.getInputProps("amount")}
              required
            />
            <DateInput
              name="date"
              label="Date"
              placeholder='Select Transaction Date'
              valueFormat='DD.MM.YYYY'
              maxDate={new Date()}
              {...transactionForm.getInputProps("date")}
              required
            />
          </Group>
          <TextInput
            name="reference"
            label="Reference"
            placeholder='Enter Transaction Reference'
            {...transactionForm.getInputProps("reference")}
          />
          <Button
            variant='gradient'
            gradient={{ from: "lime", to: "teal", deg: 339 }}
            type='submit'
          >
            {formMode === "add" ? "Add Transaction" : "Update Transaction"}
          </Button>
        </Stack>
      </form>

    </div>
  )
}

export default TransactionForm