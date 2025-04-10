const asyncHandler = require('express-async-handler');
const Subscription = require('../models/subscriptionModel');
const User = require('../models/userModel');

// @desc    Get all subscriptions
// @route   GET /api/subscriptions
// @access  Private/Admin
const getSubscriptions = asyncHandler(async (req, res) => {
  const subscriptions = await Subscription.find({})
    .populate('vendor', 'name email phone pincode isActive')
    .sort({ createdAt: -1 });

  res.json(subscriptions);
});

// @desc    Get vendor subscription
// @route   GET /api/subscriptions/vendor
// @access  Private/Vendor
const getVendorSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findOne({ vendor: req.user._id })
    .sort({ createdAt: -1 });

  if (subscription) {
    res.json(subscription);
  } else {
    res.status(404);
    throw new Error('No subscription found');
  }
});

// @desc    Create a subscription
// @route   POST /api/subscriptions
// @access  Private/Vendor
const createSubscription = asyncHandler(async (req, res) => {
  const { plan, upiId } = req.body;
  const SubscriptionPlan = require('../models/subscriptionPlanModel');

  // Get plan details from database
  const planDetails = await SubscriptionPlan.findOne({ planId: plan, isActive: true });
  
  if (!planDetails) {
    res.status(400);
    throw new Error('Invalid or inactive plan selected');
  }
  
  const { price, features, durationDays } = planDetails;

  // Calculate end date
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + durationDays);

  // Check if vendor already has an active subscription
  const existingSubscription = await Subscription.findOne({
    vendor: req.user._id,
    status: 'active',
  });

  if (existingSubscription) {
    res.status(400);
    throw new Error('You already have an active subscription');
  }

  const subscription = await Subscription.create({
    vendor: req.user._id,
    plan,
    price,
    startDate,
    endDate,
    upiId,
    features,
    status: 'pending',
    paymentStatus: 'pending',
  });

  if (subscription) {
    res.status(201).json(subscription);
  } else {
    res.status(400);
    throw new Error('Invalid subscription data');
  }
});

// @desc    Update subscription payment proof
// @route   PUT /api/subscriptions/:id/payment
// @access  Private/Vendor
const updatePaymentProof = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findById(req.params.id);

  if (!subscription) {
    res.status(404);
    throw new Error('Subscription not found');
  }

  // Check if the subscription belongs to the logged-in vendor
  if (subscription.vendor.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this subscription');
  }

  // Update payment proof
  subscription.paymentProof = req.body.paymentProof;
  subscription.paymentDate = new Date();
  subscription.paymentStatus = 'pending'; // Admin will verify and change to 'paid'

  const updatedSubscription = await subscription.save();

  res.json(updatedSubscription);
});

// @desc    Verify subscription payment
// @route   PUT /api/subscriptions/:id/verify
// @access  Private/Admin
const verifySubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findById(req.params.id);

  if (!subscription) {
    res.status(404);
    throw new Error('Subscription not found');
  }

  // Update subscription status
  subscription.paymentStatus = req.body.paymentStatus;
  
  if (req.body.paymentStatus === 'paid') {
    subscription.status = 'active';
  }

  const updatedSubscription = await subscription.save();

  res.json(updatedSubscription);
});

// @desc    Get subscription plans
// @route   GET /api/subscriptions/plans
// @access  Public
const getSubscriptionPlans = asyncHandler(async (req, res) => {
  const SubscriptionPlan = require('../models/subscriptionPlanModel');
  
  // Get all active plans from database
  const plans = await SubscriptionPlan.find({ isActive: true }).sort({ price: 1 });
  
  // If no plans found in database, initialize with default plans
  if (plans.length === 0) {
    await initializeDefaultPlans();
    const defaultPlans = await SubscriptionPlan.find({}).sort({ price: 1 });
    return res.json(defaultPlans);
  }
  
  res.json(plans);
});

// Helper function to initialize default subscription plans
const initializeDefaultPlans = async () => {
  const SubscriptionPlan = require('../models/subscriptionPlanModel');
  
  const defaultPlans = [
    {
      planId: 'basic',
      name: 'Basic Plan',
      price: 999,
      duration: '30 days',
      durationDays: 30,
      features: ['Basic service listing', 'Customer support', '30 days validity'],
      description: 'Perfect for new vendors starting their business',
      isActive: true
    },
    {
      planId: 'standard',
      name: 'Standard Plan',
      price: 2499,
      duration: '90 days',
      durationDays: 90,
      features: ['Featured service listing', 'Priority customer support', 'Analytics dashboard', '90 days validity'],
      description: 'Ideal for growing businesses looking to expand their reach',
      isActive: true
    },
    {
      planId: 'premium',
      name: 'Premium Plan',
      price: 4999,
      duration: '180 days',
      durationDays: 180,
      features: ['Premium service listing', 'Dedicated customer support', 'Advanced analytics', 'Marketing tools', '180 days validity'],
      description: 'Best value for established businesses seeking maximum visibility',
      isActive: true
    },
  ];
  
  try {
    // Insert default plans if they don't exist
    for (const plan of defaultPlans) {
      await SubscriptionPlan.findOneAndUpdate(
        { planId: plan.planId },
        plan,
        { upsert: true, new: true }
      );
    }
  } catch (error) {
    console.error('Error initializing default plans:', error);
  }
};

// @desc    Update subscription plan
// @route   PUT /api/subscriptions/plans/:id
// @access  Private/Admin
const updateSubscriptionPlan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, price, duration, durationDays, features, description, offers, isActive } = req.body;

  // Validate plan ID
  if (!['basic', 'standard', 'premium'].includes(id)) {
    res.status(400);
    throw new Error('Invalid plan ID');
  }

  const SubscriptionPlan = require('../models/subscriptionPlanModel');
  
  // Find the plan in the database
  const plan = await SubscriptionPlan.findOne({ planId: id });
  
  if (!plan) {
    res.status(404);
    throw new Error('Subscription plan not found');
  }
  
  // Update plan details
  plan.name = name || plan.name;
  plan.price = price !== undefined ? price : plan.price;
  plan.duration = duration || plan.duration;
  plan.durationDays = durationDays !== undefined ? durationDays : plan.durationDays;
  plan.features = features || plan.features;
  plan.description = description || plan.description;
  plan.offers = offers || plan.offers;
  plan.isActive = isActive !== undefined ? isActive : plan.isActive;
  
  const updatedPlan = await plan.save();
  
  res.json(updatedPlan);
});

// @desc    Create a new subscription plan
// @route   POST /api/subscriptions/plans
// @access  Private/Admin
const createSubscriptionPlan = asyncHandler(async (req, res) => {
  const { planId, name, price, duration, durationDays, features, description, offers, isActive } = req.body;
  
  const SubscriptionPlan = require('../models/subscriptionPlanModel');
  
  // Check if plan with this ID already exists
  const planExists = await SubscriptionPlan.findOne({ planId });
  
  if (planExists) {
    res.status(400);
    throw new Error('A plan with this ID already exists');
  }
  
  // Create new plan
  const plan = await SubscriptionPlan.create({
    planId,
    name,
    price,
    duration,
    durationDays,
    features,
    description,
    offers,
    isActive: isActive !== undefined ? isActive : true
  });
  
  if (plan) {
    res.status(201).json(plan);
  } else {
    res.status(400);
    throw new Error('Invalid plan data');
  }
});

module.exports = {
  getSubscriptions,
  getVendorSubscription,
  createSubscription,
  updatePaymentProof,
  verifySubscription,
  getSubscriptionPlans,
  updateSubscriptionPlan,
  createSubscriptionPlan,
};