require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/customerLocations', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const customerSchema = new mongoose.Schema({
  name: String,
  address: String,
  contactInfo: String,
  location: {
    lat: Number,
    lng: Number
  }
});

const Customer = mongoose.model('Customer', customerSchema);

app.post('/customers', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).send(customer);
  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).send({ message: 'Error adding customer', error });
  }
});

app.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).send(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).send({ message: 'Error fetching customers', error });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

