const { createClient } = require('@supabase/supabase-js');
const env = require('dotenv');
const { response } = require('express');
env.config();
const supabase = createClient(process.env.URL, process.env.ANON_KEY);

/*********************************************************************USERS***************************************************************************/
exports.createUser = async (request, response)=>  {
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
}

exports.getUsers = async(_, response) => {
    await supabase.from('Customer').select().then((data)=>{
        if (Object.keys(data.data).length > 0) {
          response.status(200).send(data.data)
        } else 
        response.status(404).send('Not found')
      }).catch((error) => {
        response.status(500).send(error)
      })
}

exports.getUser = async(request, response) => {
    await supabase.from('Customer').select().eq('accountNumber', request.body.accountNumber).then((data)=>{
        if (Object.keys(data.data).length > 0) {
          response.status(200).send(data.data)
        } else {
          response.status(404).send('Not found')
        }
        
      }).catch((error) => {
        response.status(500).send(error)
      })
}

exports.updateUser = async(request, response) => {
    await supabase.from('Customer').update({
        'firstName': request.body.firstName,
        'lastName': request.body.lastName,
        'accountNumber': request.body.accountNumber,
        'PIN': request.body.PIN
      }).eq('username', request.body.username).then((_) => {
        response.status(200).send('Updated successfully')
      }).catch((error) => {
        response.status(500).send(error)
      })
}

exports.getBalance = async(request, response) => {
  await supabase
        .from('Transaction')
        .select('balance')
        .eq('accountNumber', request.body.accountNumber)
        .eq('status', 'approved')
        .order('id', {ascending: false})
        .limit(1)
        .then((data)=>{
          response.status(200).send(data.data)
        })
        .catch((error) => {
          response.status(500).send(error)
        })
}


exports.requestTransaction = async(request, response) => {
    await supabase.from('Transaction').insert({
        'accountNumber': request.body.accountNumber,
        'username':request.body.username,
        'description': request.body.description,
        'creditDebit': request.body.creditdebit,
        'amount': request.body.amount,
        'status': 'pending',
        'issuedBy': request.body.issuedBy,
        'balance': request.body.balance,
      }).then((_) => {
        response.status(202).send('Waiting for approval...')
      }).catch((error) => {
        response.status(500).send(error)
      })
}

exports.getTransactionsForUser = async(request, response) => {
    await supabase.from('Transaction')
  .select()
  .eq('accountNumber', request.body.accountNumber)
  .then((data) => {
    response.status(200).send(data.data)
  })
  .catch((error) => {
    response.status(500).send(error)
  })
}

exports.getTransactions = async(_, response) => {
  await supabase.from('Transaction')
  .select()
  .then((data) => {
    response.status(200).send(data.data)
  })
  .catch((error) => {
    response.status(500).send(error)
  })
}

exports.getRetailerLocations = async(request, response) => {
    await supabase.from('Retailer').select().eq('retailerName', request.body.retailerName).then((data)=>{
        response.status(200).send(data.data)
      }).catch((error) => {
        response.status(500).send(error)
      })
}

exports.deleteUser = async(request, response) => {
    await supabase.from('Customer').delete().eq('username', request.body.username).then((_) => {
        response.status(200).send('Deleted successfully')
      }).catch((error) => {
        response.status(500).send(error)
      })
}

/**************************************************************************************RETAILERS*************************************************************************************/
exports.createRetailer = async(request, response) => {
    await supabase.from('Retailer').insert({
        'retailerName': request.body.retailerName,
        'retailerAddress': request.body.retailerAddress
      }).then((data) => {
        response.status(201).send(data)
      }).catch((error) => {
        response.status(500).send(error)
      })
}

exports.getRetailers = async(_, response) => {
    await supabase.from('Retailer').select().then((data) => {
        response.status(200).send(data.data)
      }).catch((error) => {
        response.status(500).send(error)
      })
}

exports.getRetailer = async(request, response) => {
    await supabase.from('Retailer').select().eq('retailerName', request.body.retailerName).then((data)=>{
        response.status(200).send(data.data)
      }).catch((error) => {
        response.status(500).send(error)
      })
}

exports.updateRetailer = async(request, response) => {
    await supabase.from('Retailer').update({
        'retailerName': request.body.retailerName,
        'retailerLocation': request.body.retailerLocation,
      }).eq('retailerName', request.body.retailerName).then((_) => {
        response.status(200).send('Updated successfully')
      }).catch((error) => {
        response.status(500).send(error)
      })
}

exports.processTransaction = async(request, response) => {
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
    'creditDebit': request.body.creditdebit,
    'amount': request.body.amount,
    'status': 'approved',
    'balance': new_balance,
    'issuedBy': request.body.issuedBy
  }).eq('accountNumber', request.body.accountNumber).then((_) => {
    response.status(200).send('Approved')
  }).catch((error) => {
    response.status(500).send(error)
  })
}

exports.deleteRetailer = async(request, response) => {
    await supabase.from('Retailer').delete().eq('retailerName', request.body.retailerName).then((_) => {
        response.status(200).send('Deleted successfully')
      }).catch((error) => {
        response.status(500).send(error)
      })
}

/*****************************************************************************************************************************************************************/
/*
 * These controllers will be used by both the customer and retailer
*/

exports.sumCredit = async(request, response) => {
  await supabase.from('Transaction')
  .select('amount.sum()')
  .eq('status', 'approved')
  .eq('creditDebit', 'credit')
  .eq('issuedBy', request.body.issuedBy)
  .then((data) => {
    response.status(200).send(data)
  })
  .catch((error) => {
    response.status(500).send(error)
  })
}

exports.sumDebit = async(request, response) => {
  await supabase.from('Transaction')
  .select('amount.sum()')
  .eq('status', 'approved')
  .eq('creditDebit', 'debit')
  .eq('issuedBy', request.body.issuedBy)
  .then((data) => {
    response.status(200).send(data)
  })
  .catch((error) => {
    response.status(500).send(error)
  })
}

exports.maxCredit = async(request, response) => {
  await supabase.from('Transaction')
  .select('amount.max()')
  .eq('status', 'approved')
  .eq('creditDebit', 'credit')
  .eq('issuedBy', request.body.issuedBy)
  .then((data) => {
    response.status(200).send(data)
  })
  .catch((error) => {
    response.status(500).send(error)
  })
}

exports.maxDebit = async(request, response) => {
  await supabase.from('Transaction')
  .select('amount.max()')
  .eq('status', 'approved')
  .eq('creditDebit', 'debit')
  .eq('issuedBy', request.body.issuedBy)
  .then((data) => {
    response.status(200).send(data)
  })
  .catch((error) => {
    response.status(500).send(error)
  })
}
















