import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';

import { Box, Button, Card, Divider, Group, Modal } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { fireDb } from '../firebaseConfig';
import moment from 'moment';

import Header from '../components/Header';
import TransactionForm from '../components/TransactionForm';
import TransactionsTable from '../components/TransactionsTable';
import Filters from '../components/Filters';
import Analytics from '../components/Analytics';

function Home() {
  const [view, setView] = React.useState("table");
  const [filters, setFilters] = React.useState({
    type: "",
    frequency: "30",
    dateRange: [],
  });
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const [transactions, setTransactions] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);
  const [formMode, setFormMode] = React.useState("add");
  const [selectedTransaction, setSelectedTransaction] = React.useState({});

  const getWhereConditions = () => {
    const tempConditions = [];
    // type condition Filter
    if (filters.type !== "") {
      tempConditions.push(where("type", "==", filters.type));
    }

    // frequency condition Filter
    if (filters.frequency !== "custom-range" && filters.frequency !== "") {
      tempConditions.push(
        where("date", ">=", new Date(moment().subtract(filters.frequency, "days")))
      );
    } else if (filters.frequency === "custom-range" && filters.dateRange[1] != null) {
      const fromDate = new Date(moment(filters.dateRange[0]));
      const toDate = new Date(moment(filters.dateRange[1]));
      tempConditions.push(where("date", ">=", fromDate));
      tempConditions.push(where("date", "<=", toDate));
    }
    return tempConditions;
  }

  const getData = async () => {

    const whereConditions = getWhereConditions();

    try {
      dispatch(ShowLoading());
      const qry = query(
        collection(fireDb, `users/${user.id}/transactions`),
        orderBy("date", "desc"),
        ...whereConditions
      );
      const response = await getDocs(qry);
      const data = response.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTransactions(data);
      dispatch(HideLoading());
    } catch (error) {
      console.log(error);
      notifications.show({
        title: "Error getting Transactions",
        message: "Could not fetch information :(",
        color: "red",
      });
      dispatch(HideLoading());
    }
  }

  useEffect(() => {
    getData()
  }, [filters])


  return (
    <Box
      mx={20} 
      style={{maxWidth: '1200px'}}
    >
      <Header />
      <div className='container'>
        <Card
          shadow='md'
          withBorder
          mt={20}
        >
          <div className='flex justify-between items-end'>
            <div className='flex'>
              <Filters
                filters={filters}
                setFilters={setFilters}
                getData={getData}
              />
            </div>
            <Group>
              <Button.Group>
                <Button
                  variant={view === "table" ? "light" : "default"}
                  color="rgba(69, 69, 69, 1)"
                  onClick={() => setView("table")}
                >
                  Table
                </Button>
                <Button
                  variant={view === "analytics" ? "light" : "default"}
                  color="rgba(69, 69, 69, 1)"
                  onClick={() => setView("analytics")}
                >
                  Analytics
                </Button>
              </Button.Group>
              <Button
                variant="gradient"
                gradient={{ from: 'green', to: 'lime', deg: 145 }}
                autoContrast
                onClick={() => {
                  setShowForm(true);
                  setFormMode('add');
                }}
              >
                Add Transaction
              </Button>
            </Group>
          </div>
          <Divider
            mt={20}
          />
          {view === "table" && 
            <TransactionsTable
              transactions={transactions}
              setSelectedTransaction={setSelectedTransaction}
              setFormMode={setFormMode}
              setShowForm={setShowForm}
              getData={getData}
            />
          }
          {view ==="analytics" &&
            <Analytics 
              transactions={transactions}
            />
          }
        </Card>
      </div>
      <Modal
        title={formMode === "add" ? "Add Transaction" : "Edit Transaction"}
        size={'lg'}
        opened={showForm}
        onClose={() => setShowForm(false)}
        centered
      >
        <TransactionForm
          formMode={formMode}
          setFormMode={setFormMode}
          setShowForm={setShowForm}
          showForm={showForm}
          transactionData={selectedTransaction}
          getData={getData}
        />
      </Modal>
    </Box>
  )
}

export default Home