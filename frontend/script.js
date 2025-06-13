let userData = null;
    let accessToken = null;
    const YOUR_BASE_URL = 'http://localhost:5000';

    // Set up login button
    document.getElementById('loginBtn').href = `${YOUR_BASE_URL}/google`;

    // Show specific tab
    function showTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
      document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
      document.getElementById(tabId).classList.remove('hidden');
      if (tabId !== 'login') {
        document.getElementById(`${tabId}Tab`).classList.add('active');
      }
    }

    // Show login error message
    function showLoginError(message) {
      const loginMessage = document.getElementById('loginMessage');
      loginMessage.textContent = message;
      loginMessage.classList.remove('hidden');
      loginMessage.classList.add('error');
      setTimeout(() => loginMessage.classList.add('hidden'), 5000);
      console.error('Login Error:', message);
    }

    // Update profile display
    function updateProfileDisplay() {
      if (userData) {
        document.getElementById('profileFirstName').textContent = userData.firstName || '';
        document.getElementById('profileLastName').textContent = userData.lastName || '';
        document.getElementById('profileEmail').textContent = userData.email || '';
        document.getElementById('profilePhoneNumber').textContent = userData.phoneNumber || '';
        document.getElementById('profilePincode').textContent = userData.pincode || '';
        document.getElementById('profileCity').textContent = userData.city || '';
      }
    }

    // Populate update form
    function populateUpdateForm() {
      if (userData) {
        document.getElementById('firstName').value = userData.firstName || '';
        document.getElementById('lastName').value = userData.lastName || '';
        document.getElementById('phoneNumber').value = userData.phoneNumber || '';
        document.getElementById('pincode').value = userData.pincode || '';
        document.getElementById('city').value = userData.city || '';
      }
    }

    // Fetch profile data
    async function fetchProfile() {
      if (!accessToken) {
        console.warn('No access token available, skipping profile fetch');
        return;
      }
      try {
        console.log('Fetching profile with token:', accessToken);
        const response = await fetch(`${YOUR_BASE_URL}/profile`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        if (response.ok) {
          userData = await response.json();
          console.log('Profile fetched successfully:', userData);
          updateProfileDisplay();
          populateUpdateForm();
          localStorage.setItem('userData', JSON.stringify(userData));
        } else {
          let errorMessage = `Failed to fetch profile (Status: ${response.status})`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch {
            const text = await response.text();
            errorMessage = text || errorMessage;
          }
          console.error('Profile fetch failed:', response.status, errorMessage);
          showLoginError(errorMessage);
          if (response.status === 403) {
            logout(); // Logout only on invalid token
          }
        }
      } catch (error) {
        console.error('Network error fetching profile:', error.message);
        showLoginError('Network error fetching profile: ' + error.message);
      }
    }

    // Handle profile update form submission
    document.getElementById('profileUpdateForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const updateMessage = document.getElementById('updateMessage');
      const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        pincode: document.getElementById('pincode').value,
        city: document.getElementById('city').value
      };

      try {
        console.log('Updating profile with data:', formData);
        const response = await fetch(`${YOUR_BASE_URL}/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(formData)
        });

        const result = await response.json();
        updateMessage.classList.remove('hidden');

        if (response.status === 201) {
          updateMessage.textContent = 'Profile update scheduled successfully!';
          updateMessage.classList.add('success');
          updateMessage.classList.remove('error');
          userData = { ...userData, ...formData };
          updateProfileDisplay();
          localStorage.setItem('userData', JSON.stringify(userData));
          setTimeout(() => fetchProfile(), 1000);
          console.log('Profile updated successfully');
        } else {
          updateMessage.textContent = result.error || 'Failed to update profile';
          updateMessage.classList.add('error');
          updateMessage.classList.remove('success');
          console.error('Profile update failed:', result);
        }

        setTimeout(() => {
          updateMessage.classList.add('hidden');
        }, 5000);
      } catch (error) {
        updateMessage.textContent = 'Error updating profile: ' + error.message;
        updateMessage.classList.add('error');
        updateMessage.classList.remove('success');
        updateMessage.classList.remove('hidden');
        setTimeout(() => {
          updateMessage.classList.add('hidden');
        }, 5000);
        console.error('Network error updating profile:', error.message);
      }
    });

    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', async () => {
      try {
        if (accessToken) {
          await fetch(`${YOUR_BASE_URL}/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          console.log('Logout request sent to backend');
        }
      } catch (error) {
        console.error('Error during logout request:', error.message);
      } finally {
        logout();
      }
    });

    function logout() {
      userData = null;
      accessToken = null;
      localStorage.removeItem('userData');
      localStorage.removeItem('accessToken');
      document.getElementById('profileTab').classList.add('hidden');
      document.getElementById('profileUpdateTab').classList.add('hidden');
      document.getElementById('logoutBtn').classList.add('hidden');
      showTab('login');
      showLoginError('Logged out successfully');
      console.log('Client-side logout completed');
    }

    // Handle URL parameters and session restoration
    function handleAuthResponse() {
      // Check localStorage first
      const storedUserData = localStorage.getItem('userData');
      const storedAccessToken = localStorage.getItem('accessToken');

      if (storedUserData && storedAccessToken) {
        try {
          userData = JSON.parse(storedUserData);
          accessToken = storedAccessToken;
          console.log('Restored session from localStorage:', userData);
          updateProfileDisplay();
          populateUpdateForm();
          document.getElementById('profileTab').classList.remove('hidden');
          document.getElementById('profileUpdateTab').classList.remove('hidden');
          document.getElementById('logoutBtn').classList.remove('hidden');
          showTab('profile');
          fetchProfile(); // Refresh profile data
          return;
        } catch (e) {
          console.error('Error restoring session:', e);
          localStorage.removeItem('userData');
          localStorage.removeItem('accessToken');
        }
      }

      // Handle URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const authStatus = urlParams.get('auth');
      const data = urlParams.get('data');
      const error = urlParams.get('error');

      if (authStatus === 'success' && data) {
        try {
          const decodedData = JSON.parse(decodeURIComponent(data));
          userData = decodedData.user;
          accessToken = decodedData.accessToken;
          console.log('Auth successful, user data:', userData);
          localStorage.setItem('userData', JSON.stringify(userData));
          localStorage.setItem('accessToken', accessToken);
          updateProfileDisplay();
          populateUpdateForm();
          document.getElementById('profileTab').classList.remove('hidden');
          document.getElementById('profileUpdateTab').classList.remove('hidden');
          document.getElementById('logoutBtn').classList.remove('hidden');
          showTab('profile');
          fetchProfile();
        } catch (e) {
          showLoginError('Invalid data received: ' + e.message);
          console.error('Error parsing auth data:', e);
        }
      } else if (authStatus === 'failed' && error) {
        showLoginError(decodeURIComponent(error));
        showTab('login');
        console.error('Auth failed:', decodeURIComponent(error));
      } else {
        showTab('login');
        console.log('No auth parameters, showing login page');
      }

      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Initialize
    handleAuthResponse();