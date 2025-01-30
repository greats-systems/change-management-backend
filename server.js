/*****************************************************CHANGE MANAGEMENT API SERVICE**********************************************************/

/*
- This project was created to supplement the existing Flutter implementation of the change management application
- It contains APIs for implementing CRUD applications across it's use cases
*/
import express from 'express';
import env from 'dotenv';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

env.config();
const supabase = createClient(process.env.URL, process.env.ANON_KEY);

app.get('/', (_, response) =>
  response.json({ info: 'Express app with Supabase' })
);

/*********************************************************************USER ACCOUNTS***************************************************************************/
// 1. Create user account
app.post('/account/create', async(request, response) => {
  await supabase.from('Customer').insert({
    'firstName': request.body.firstName,
    'lastName': request.body.lastName,
    'accountNumber': request.body.accountNumber,
    'username': request.body.username,
    'PIN': request.body.PIN,
  }).then((data) => {
    response.status(201).send(data)
  }).catch((error) => {
    response.status(500).send(error)
  })
})

// 2. Find all user accounts
app.get('/accounts', async(_, response) => {
  await supabase.from('Customer').select().then((data)=>{
    if (Object.keys(data.data).length > 0) {
      response.status(200).send(data.data)
    } else 
    response.status(404).send('Not found')
  }).catch((error) => {
    response.status(500).send(error)
  })
})

// 3. Find one user account
app.get('/account/:username', async(request, response) => {
  await supabase.from('Customer').select().eq('username', request.params.username).then((data)=>{
    if (Object.keys(data.data).length > 0) {
      response.status(200).send(data.data)
    } else {
      response.status(404).send('Not found')
    }
    
  }).catch((error) => {
    response.status(500).send(error)
  })
})

// 4. Update user account
app.put('/account/:username/update', async(request, response) => {
  await supabase.from('Customer').update({
    'firstName': request.body.firstName,
    'lastName': request.body.lastName,
    'accountNumber': request.body.accountNumber,
    'PIN': request.body.PIN
  }).eq('username', request.params.username).then((_) => {
    response.status(200).send('Updated successfully')
  }).catch((error) => {
    response.status(500).send(error)
  })
})

// 5. Request a transaction
app.post('/account/request-transaction', async(request, response) => {
  await supabase.from('Transaction').insert({
    'accountNumber': request.body.accountNumber,
    'description': request.body.description,
    'credit/debit': request.body.creditdebit,
    'amount': request.body.amount,
    'status': 'pending',
    'balance': request.body.balance,
  }).then((_) => {
    response.status(202).send('Waiting for approval...')
  }).catch((error) => {
    response.status(500).send(error)
  })
})

// 6. View transactions for a single user
app.get('/transactions/:accountNumber', async(request, response) => {
  await supabase.from('Transaction')
  .select()
  .eq('accountNumber', request.params.accountNumber)
  .then((data) => {
    response.status(200).send(data.data)
  }).catch((error) => {
    response.status(500).send(error)
  })
})

// 7. Find store locations
app.get('/retailers/:retailerName/locations', async(request, response) => {
  await supabase.from('Retailer').select().eq('retailerName', request.params.retailerName).then((data)=>{
    response.status(200).send(data.data)
  }).catch((error) => {
    response.status(500).send(error)
  })
})

// 7. Delete user account
app.delete('/account/:username/delete', async(request, response) => {
  await supabase.from('Customer').delete().eq('username', request.params.username).then((_) => {
    response.status(200).send('Deleted successfully')
  }).catch((error) => {
    response.status(500).send(error)
  })
})

/**************************************************************************************RETAILER ACCOUNTS*************************************************************************************/
// 1. Create retailer account
app.post('/retailer/create', async(request, response) => {
  await supabase.from('Retailer').insert({
    'retailerName': request.body.retailerName,
    'retailerAddress': request.body.retailerAddress
  }).then((data) => {
    response.status(201).send(data)
  }).catch((error) => {
    response.status(500).send(error)
  })
})

// 2. Find all retailer accounts
app.get('/retailers', async(_, response) => {
  await supabase.from('Retailer').select().then((data) => {
    response.status(200).send(data.data)
  }).catch((error) => {
    response.status(500).send(error)
  })
})

// 3. Find one retailer account
app.get('/retailers/:retailerName', async(request, response) => {
  await supabase.from('Retailer').eq('retailerName', request.params.retailerName).select().then((data)=>{
    response.status(200).send(data.data)
  }).catch((error) => {
    response.status(500).send(error)
  })
})

// 4. Update retailer account
app.put('/retailer/:retailerName/update', async(request, response) => {
  await supabase.from('Retailer').update({
    'retailerName': request.body.retailerName,
    'retailerLocation': request.body.retailerLocation,
  }).eq('retailerName', request.params.retailerName).then((_) => {
    response.status(200).send('Updated successfully')
  }).catch((error) => {
    response.status(500).send(error)
  })
})

// 5. Process a transaction
app.post('/retailer/:accountNumber/approve-transaction', async(request, response) => {
  const new_balance = 0.0
  if(request.body.creditdebit == 'credit'){
    new_balance = parseFloat(request.body.oldBalance) + parseFloat(request.body.amount)
  } else {
    new_balance = parseFloat(request.body.oldBalance) - parseFloat(request.body.amount)
    if (new_balance < 0) {
      response.status(51).send('Denied: Insufficient funds')
    }
  }  
  await supabase.from('Transaction').update({    
    'description': request.body.description,
    'credit/debit': request.body.creditdebit,
    'amount': request.body.amount,
    'status': 'approved',
    'balance': new_balance,
    'issuedBy': request.body.issuedBy
  }).eq('accountNumber', request.params.accountNumber).then((_) => {
    response.status(200).send('Approved')
  }).catch((error) => {
    response.status(500).send(error)
  })
})


// 6. Delete retailer account
app.delete('/retailer/:retailerName/delete', async(request, response) => {
  await supabase.from('Retailer').delete().eq('retailerName', request.params.retailerName).then((_) => {
    response.status(200).send('Deleted successfully')
  }).catch((error) => {
    response.status(500).send(error)
  })
})


/*******************************************************************EXTRAS**************************************************************/

app.get('/dummy-data', async (_, response) => {
  await supabase
    .from('Test')
    .select()
    .then((data) => {
      response.status(200).send(data.data);
    })
    .catch((error) => {
      response.status(500).send(error);
    });
});

app.post('/dummy-data', async (request, response) => {
  const { data, error } = await supabase.from('Test').insert({
    'column_1': request.body.column_1,
    'column_2': request.body.column_2,
  });
  response.status(201).send('Created succesfully');
});

/************************************************************************RUN************************************************************************/
app.listen(3000, () =>
  console.log(
    new Date().toLocaleTimeString() + `: Server is running on port ${3000}...`
  )
);
