import React from 'react';
import '../stylesheets/analytics.css';
import { Divider, Group, Progress, RingProgress, Text } from '@mantine/core';

function Analytics({ transactions }) {
  const numberFormatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR'});

  const totalTransactions = transactions.length;
  // for transactions Count
  const totalIncomeTransactions = transactions.filter(transaction => transaction.type === "income").length;
  const totalExpenseTransactions = transactions.filter(transaction => transaction.type === "expense").length;
  const totalIncomeTransactionsPercentage = (totalIncomeTransactions / totalTransactions) * 100;
  const totalExpenseTransactionsPercentage = (totalExpenseTransactions / totalTransactions) * 100;
  // for Transactions amount
  const totalAmount = transactions.reduce((acc, transaction) => {
    return acc + Number(transaction.amount);
  }, 0);
  const totalIncomeAmount = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((acc, transaction) => {
      return acc + Number(transaction.amount);
    }, 0);
  const totalExpenseAmount = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, transaction) => {
      return acc + Number(transaction.amount);
    }, 0);
  const totalIncomeAmountPercentage = (totalIncomeAmount / totalAmount) * 100;
  const totalExpenseAmountPercentage = (totalExpenseAmount / totalAmount) * 100;

  const categories = [
    { value: "food", label: "Food" },
    { value: "transport", label: "Transport" },
    { value: "shopping", label: "Shopping" },
    { value: "entertainment", label: "Entertainment" },
    { value: "health", label: "Health" },
    { value: "education", label: "Education" },
    { value: "salary", label: "Salary" },
    { value: "gifts", label: "Gifts" },
    { value: "other", label: "Other" },
  ];

  return (
    <div>
      <Group mt={20} justify="center">
        <div className='total-transactions'>
          <h1 className='card-title'>
            Total Transactions : {totalTransactions}
          </h1>
          <Divider my={20} />
          <Group mx={50} justify='space-between'>
            <p>
              Income : {totalIncomeTransactions}
            </p>
            <p>
              Expense : {totalExpenseTransactions}
            </p>
          </Group>
          <Group justify='space-between'>
            <RingProgress
              label={
                <Text size="m" ta="center">
                  Income <br /> {totalIncomeTransactionsPercentage.toFixed(0)}%
                </Text>
              }
              size={210}
              thickness={34}
              roundCaps
              sections={[
                { value: totalIncomeTransactionsPercentage, color: 'green' },
              ]}
            />
            <RingProgress
              label={
                <Text size="m" ta="center">
                  Expense <br /> {totalExpenseTransactionsPercentage.toFixed(0)}%
                </Text>
              }
              size={210}
              thickness={34}
              roundCaps
              sections={[
                { value: totalExpenseTransactionsPercentage, color: 'orange' },
              ]}
            />
          </Group>
        </div>
        <div className='total-turnover'>
          <h1 className='card-title'>
            Total Turnover : {numberFormatter.format(totalAmount)}
          </h1>
          <Divider my={20} />
          <Group mx={20} justify='space-between'>
            <p>
              Income  : {numberFormatter.format(totalIncomeAmount)}
            </p>
            <p>
              Expense  : {numberFormatter.format(totalExpenseAmount)}
            </p>
          </Group>
          <Group justify='space-between'>
            <RingProgress
              label={
                <Text size="m" ta="center">
                  Income <br /> {totalIncomeAmountPercentage.toFixed(0)}%
                </Text>
              }
              size={210}
              thickness={34}
              roundCaps
              sections={[
                { value: totalIncomeAmountPercentage, color: 'green' },
              ]}
            />
            <RingProgress
              label={
                <Text size="m" ta="center">
                  Expense <br /> {totalExpenseAmountPercentage.toFixed(0)}%
                </Text>
              }
              size={210}
              thickness={34}
              roundCaps
              sections={[
                { value: totalExpenseAmountPercentage, color: 'orange' },
              ]}
            />
          </Group>
        </div>
      </Group>
      <Group mt={20} justify="center">
        <div className='income-categories'>
          <h1 className='card-title'>Income Categories</h1>
          <Divider my={20} />
          {categories.map((category) => {
            const incomeCategoryTransactionsAmount = transactions
              .filter(
                (transaction) =>
                  transaction.type === "income" &&
                  transaction.category === category.value
              )
              .reduce((acc, transaction) => {
                return acc + Number(transaction.amount);
              }, 0);
            const incomeCategoryTransactionsPercentage =
              (incomeCategoryTransactionsAmount / totalIncomeAmount) * 100;
            return (
              <div>
                <p className='progress-label'>{category.label}</p>
                <Progress.Root size={35}>
                  <Progress.Section
                    value={incomeCategoryTransactionsPercentage}
                    color='lime'
                  >
                    <Progress.Label style={{color: 'black'}}>{incomeCategoryTransactionsPercentage.toFixed(0) + "%"}</Progress.Label>
                  </Progress.Section>
                </Progress.Root>
              </div>
            );
          })}
        </div>
        <div className='expense-categories'>
          <h1 className='card-title'>Expense Categories</h1>
          <Divider my={20} />
          {categories.map((category) => {
            const expenseCategoryTransactionsAmount = transactions
              .filter(
                (transaction) =>
                  transaction.type === "expense" &&
                  transaction.category === category.value
              )
              .reduce((acc, transaction) => {
                return acc + Number(transaction.amount);
              }, 0);
            const expenseCategoryTransactionsPercentage =
              (expenseCategoryTransactionsAmount / totalExpenseAmount) * 100;
            return (
              <div>
                <p className='progress-label'>{category.label}</p>
                <Progress.Root size={35}>
                  <Progress.Section
                    value={expenseCategoryTransactionsPercentage}
                    color='red'
                  >
                    <Progress.Label>{expenseCategoryTransactionsPercentage.toFixed(0) + "%"}</Progress.Label>
                  </Progress.Section>
                </Progress.Root>
              </div>
            );
          })}
        </div>
      </Group>
    </div>
  )
}

export default Analytics