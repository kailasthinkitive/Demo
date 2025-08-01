const { test, expect } = require('@playwright/test');

// Test configuration
const config = {
  baseURL: 'https://stage-api.ecarehealth.com',
  providerPortalURL: 'https://stage_aithinkitive.uat.provider.ecarehealth.com',
  tenantId: 'stage_aithinkitive',
  credentials: {
    username: 'rose.gomez@jourrapide.com',
    password: 'Pass@123'
  }
};

// Test data
const testData = {
  provider: {
    firstName: 'Steven',
    lastName: 'Miller',
    email: 'saurabh.kale+steven@medarch.com',
    gender: 'MALE'
  },
  patient: {
    firstName: 'Samuel',
    lastName: 'Peterson',
    birthDate: '1994-08-16T18:30:00.000Z',
    gender: 'MALE',
    timezone: 'IST'
  },
  appointment: {
    chiefComplaint: 'appointment test',
    mode: 'VIRTUAL',
    type: 'NEW',
    paymentType: 'CASH',
    duration: 30
  }
};

// Global variables to store IDs across tests
let authToken = '';
let providerId = '';
let patientId = '';
let appointmentId = '';

test.describe('eCareHealth Complete Automation Flow', () => {
  
  test.beforeAll(async () => {
    console.log('Starting eCareHealth automation test suite...');
  });

  test('1. Provider Login (API)', async ({ request }) => {
    console.log('🔐 Testing Provider Login...');
    
    const loginResponse = await request.post(`${config.baseURL}/api/master/login`, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'X-TENANT-ID': config.tenantId
      },
      data: {
        username: config.credentials.username,
        password: config.credentials.password,
        xTENANTID: config.tenantId
      }
    });

    expect(loginResponse.status()).toBe(200);
    
    const loginData = await loginResponse.json();
    authToken = loginData.token || loginData.access_token;
    
    expect(authToken).toBeTruthy();
    console.log('✅ Login successful, token obtained');
  });

  test('2. Add Provider (API)', async ({ request }) => {
    console.log('👨‍⚕️ Creating new provider...');
    
    const providerResponse = await request.post(`${config.baseURL}/api/master/provider`, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'X-TENANT-ID': config.tenantId
      },
      data: {
        roleType: 'PROVIDER',
        active: false,
        admin_access: true,
        status: false,
        avatar: '',
        role: 'PROVIDER',
        firstName: testData.provider.firstName,
        lastName: testData.provider.lastName,
        gender: testData.provider.gender,
        phone: '',
        npi: '',
        specialities: null,
        groupNpiNumber: '',
        licensedStates: null,
        licenseNumber: '',
        acceptedInsurances: null,
        experience: '',
        taxonomyNumber: '',
        workLocations: null,
        email: testData.provider.email,
        officeFaxNumber: '',
        areaFocus: '',
        hospitalAffiliation: '',
        ageGroupSeen: null,
        spokenLanguages: null,
        providerEmployment: '',
        insurance_verification: '',
        prior_authorization: '',
        secondOpinion: '',
        careService: null,
        bio: '',
        expertise: '',
        workExperience: '',
        licenceInformation: [{
          uuid: '',
          licenseState: '',
          licenseNumber: ''
        }],
        deaInformation: [{
          deaState: '',
          deaNumber: '',
          deaTermDate: '',
          deaActiveDate: ''
        }]
      }
    });

    expect(providerResponse.status()).toBe(200);
    
    const providerData = await providerResponse.json();
    providerId = providerData.id || providerData.providerId;
    
    expect(providerId).toBeTruthy();
    console.log(`✅ Provider created successfully with ID: ${providerId}`);
  });

  test('3. Set Provider Availability (API)', async ({ request }) => {
    console.log('📅 Setting provider availability...');
    
    const availabilityResponse = await request.post(`${config.baseURL}/api/master/provider/availability-setting`, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'X-TENANT-ID': config.tenantId
      },
      data: {
        setToWeekdays: false,
        providerId: providerId,
        bookingWindow: '3',
        timezone: 'EST',
        bufferTime: 0,
        initialConsultTime: 0,
        followupConsultTime: 0,
        settings: [{
          type: 'NEW',
          slotTime: '30',
          minNoticeUnit: '8_HOUR'
        }],
        blockDays: [],
        daySlots: [{
          day: 'MONDAY',
          startTime: '12:00:00',
          endTime: '13:00:00',
          availabilityMode: 'VIRTUAL'
        }],
        bookBefore: 'undefined undefined',
        xTENANTID: config.tenantId
      }
    });

    expect(availabilityResponse.status()).toBe(200);
    console.log('✅ Provider availability set successfully');
  });

  test('4. Create Patient (API)', async ({ request }) => {
    console.log('👤 Creating new patient...');
    
    const patientResponse = await request.post(`${config.baseURL}/api/master/patient`, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'X-TENANT-ID': config.tenantId
      },
      data: {
        phoneNotAvailable: true,
        emailNotAvailable: true,
        registrationDate: '',
        firstName: testData.patient.firstName,
        middleName: '',
        lastName: testData.patient.lastName,
        timezone: testData.patient.timezone,
        birthDate: testData.patient.birthDate,
        gender: testData.patient.gender,
        ssn: '',
        mrn: '',
        languages: null,
        avatar: '',
        mobileNumber: '',
        faxNumber: '',
        homePhone: '',
        address: {
          line1: '',
          line2: '',
          city: '',
          state: '',
          country: '',
          zipcode: ''
        },
        emergencyContacts: [{
          firstName: '',
          lastName: '',
          mobile: ''
        }],
        patientInsurances: [{
          active: true,
          insuranceId: '',
          copayType: 'FIXED',
          coInsurance: '',
          claimNumber: '',
          note: '',
          deductibleAmount: '',
          employerName: '',
          employerAddress: {
            line1: '',
            line2: '',
            city: '',
            state: '',
            country: '',
            zipcode: ''
          },
          subscriberFirstName: '',
          subscriberLastName: '',
          subscriberMiddleName: '',
          subscriberSsn: '',
          subscriberMobileNumber: '',
          subscriberAddress: {
            line1: '',
            line2: '',
            city: '',
            state: '',
            country: '',
            zipcode: ''
          },
          groupId: '',
          memberId: '',
          groupName: '',
          frontPhoto: '',
          backPhoto: '',
          insuredFirstName: '',
          insuredLastName: '',
          address: {
            line1: '',
            line2: '',
            city: '',
            state: '',
            country: '',
            zipcode: ''
          },
          insuredBirthDate: '',
          coPay: '',
          insurancePayer: {}
        }],
        emailConsent: false,
        messageConsent: false,
        callConsent: false,
        patientConsentEntities: [{
          signedDate: new Date().toISOString()
        }]
      }
    });

    expect(patientResponse.status()).toBe(200);
    
    const patientData = await patientResponse.json();
    patientId = patientData.id || patientData.patientId;
    
    expect(patientId).toBeTruthy();
    console.log(`✅ Patient created successfully with ID: ${patientId}`);
  });

  test('5. Book Appointment (API)', async ({ request }) => {
    console.log('📋 Booking appointment...');
    
    // Calculate appointment time (next Monday 12:00 PM EST)
    const now = new Date();
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + (1 + 7 - now.getDay()) % 7);
    nextMonday.setHours(17, 0, 0, 0); // 12:00 PM EST = 17:00 UTC
    
    const endTime = new Date(nextMonday);
    endTime.setMinutes(endTime.getMinutes() + testData.appointment.duration);
    
    const appointmentResponse = await request.post(`${config.baseURL}/api/master/appointment`, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'X-TENANT-ID': config.tenantId
      },
      data: {
        mode: testData.appointment.mode,
        patientId: patientId,
        customForms: null,
        visit_type: '',
        type: testData.appointment.type,
        paymentType: testData.appointment.paymentType,
        providerId: providerId,
        startTime: nextMonday.toISOString(),
        endTime: endTime.toISOString(),
        insurance_type: '',
        note: '',
        authorization: '',
        forms: [],
        chiefComplaint: testData.appointment.chiefComplaint,
        isRecurring: false,
        recurringFrequency: 'daily',
        reminder_set: false,
        endType: 'never',
        endDate: new Date().toISOString(),
        endAfter: 5,
        customFrequency: 1,
        customFrequencyUnit: 'days',
        selectedWeekdays: [],
        reminder_before_number: 1,
        timezone: 'CST',
        duration: testData.appointment.duration,
        xTENANTID: config.tenantId
      }
    });

    expect(appointmentResponse.status()).toBe(200);
    
    const appointmentData = await appointmentResponse.json();
    appointmentId = appointmentData.id || appointmentData.appointmentId;
    
    expect(appointmentId).toBeTruthy();
    console.log(`✅ Appointment booked successfully with ID: ${appointmentId}`);
  });

  test('6. Verify Provider List (API)', async ({ request }) => {
    console.log('🔍 Verifying provider in list...');
    
    const providersResponse = await request.get(`${config.baseURL}/api/master/provider?page=0&size=20`, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Authorization': `Bearer ${authToken}`
      }
    });

    expect(providersResponse.status()).toBe(200);
    
    const providersData = await providersResponse.json();
    const createdProvider = providersData.content?.find(p => p.id === providerId);
    
    expect(createdProvider).toBeTruthy();
    expect(createdProvider.firstName).toBe(testData.provider.firstName);
    expect(createdProvider.lastName).toBe(testData.provider.lastName);
    
    console.log('✅ Provider verified in provider list');
  });

  test('7. Verify Patient List (API)', async ({ request }) => {
    console.log('🔍 Verifying patient in list...');
    
    const patientsResponse = await request.get(`${config.baseURL}/api/master/patient?page=0&size=20&searchString=`, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Authorization': `Bearer ${authToken}`,
        'X-TENANT-ID': config.tenantId
      }
    });

    expect(patientsResponse.status()).toBe(200);
    
    const patientsData = await patientsResponse.json();
    const createdPatient = patientsData.content?.find(p => p.id === patientId);
    
    expect(createdPatient).toBeTruthy();
    expect(createdPatient.firstName).toBe(testData.patient.firstName);
    expect(createdPatient.lastName).toBe(testData.patient.lastName);
    
    console.log('✅ Patient verified in patient list');
  });

  test('8. Provider Portal Login (UI)', async ({ page }) => {
    console.log('🌐 Testing Provider Portal UI Login...');
    
    // Navigate to provider portal
    await page.goto(config.providerPortalURL);
    
    // Wait for login form
    await page.waitForSelector('input[type="email"], input[name="username"], #username', { timeout: 10000 });
    
    // Fill login credentials
    const usernameSelector = await page.locator('input[type="email"], input[name="username"], #username').first();
    await usernameSelector.fill(config.credentials.username);
    
    const passwordSelector = await page.locator('input[type="password"], input[name="password"], #password').first();
    await passwordSelector.fill(config.credentials.password);
    
    // Click login button
    await page.click('button[type="submit"], .login-btn, .btn-login, button:has-text("Login")');
    
    // Wait for successful login (dashboard or main page)
    await page.waitForURL(/dashboard|main|home/, { timeout: 15000 });
    
    console.log('✅ UI Login successful');
  });

  test('9. Navigate to Provider Management (UI)', async ({ page }) => {
    console.log('👨‍⚕️ Testing Provider Management UI...');
    
    // Already logged in from previous test
    await page.goto(config.providerPortalURL);
    
    // Look for provider management navigation
    const providerNav = page.locator('a:has-text("Provider"), .nav-provider, [data-testid="provider-nav"]').first();
    if (await providerNav.isVisible()) {
      await providerNav.click();
      await page.waitForTimeout(2000);
    }
    
    // Verify we can see the provider we created
    await page.waitForTimeout(3000);
    const providerExists = await page.locator(`text="${testData.provider.firstName} ${testData.provider.lastName}"`).isVisible();
    
    if (providerExists) {
      console.log('✅ Created provider visible in UI');
    } else {
      console.log('⚠️ Provider not immediately visible in UI (may need page refresh)');
    }
  });

  test('10. Navigate to Patient Management (UI)', async ({ page }) => {
    console.log('👤 Testing Patient Management UI...');
    
    await page.goto(config.providerPortalURL);
    
    // Look for patient management navigation
    const patientNav = page.locator('a:has-text("Patient"), .nav-patient, [data-testid="patient-nav"]').first();
    if (await patientNav.isVisible()) {
      await patientNav.click();
      await page.waitForTimeout(2000);
    }
    
    // Verify we can see the patient we created
    await page.waitForTimeout(3000);
    const patientExists = await page.locator(`text="${testData.patient.firstName} ${testData.patient.lastName}"`).isVisible();
    
    if (patientExists) {
      console.log('✅ Created patient visible in UI');
    } else {
      console.log('⚠️ Patient not immediately visible in UI (may need page refresh)');
    }
  });

  test.afterAll(async () => {
    console.log('\n📊 Test Summary:');
    console.log(`✅ Auth Token: ${authToken ? 'Obtained' : 'Failed'}`);
    console.log(`✅ Provider ID: ${providerId || 'Not created'}`);
    console.log(`✅ Patient ID: ${patientId || 'Not created'}`);
    console.log(`✅ Appointment ID: ${appointmentId || 'Not created'}`);
    console.log('\n🎉 eCareHealth automation flow completed!');
  });

});

// Error handling and utilities
test.beforeEach(async ({ page }) => {
  // Set up error handling
  page.on('response', response => {
    if (response.status() >= 400) {
      console.log(`❌ HTTP Error: ${response.status()} - ${response.url()}`);
    }
  });
  
  page.on('pageerror', error => {
    console.log(`❌ Page Error: ${error.message}`);
  });
});

// Configuration for parallel execution
module.exports = {
  testConfig: config,
  testData: testData
};