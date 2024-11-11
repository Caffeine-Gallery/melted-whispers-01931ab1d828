import { backend } from "declarations/backend";

// Show/hide loading spinner
const showLoading = () => document.getElementById('loadingSpinner').style.display = 'flex';
const hideLoading = () => document.getElementById('loadingSpinner').style.display = 'none';

// Initialize countdown timer
async function initCountdown() {
    const remainingDays = await backend.getRemainingDays();
    const countdownElement = document.getElementById('countdown');
    countdownElement.textContent = `Only ${remainingDays} days remaining!`;
}

// Load menu items
async function loadMenu() {
    showLoading();
    try {
        const menuItems = await backend.getMenu();
        const menuContainer = document.getElementById('menu');
        
        menuItems.forEach(([name, description, price]) => {
            const menuItem = document.createElement('div');
            menuItem.className = 'col-md-6 mb-4';
            menuItem.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${name}</h5>
                        <p class="card-text">${description}</p>
                        <p class="card-text"><strong>€${price}</strong></p>
                    </div>
                </div>
            `;
            menuContainer.appendChild(menuItem);
        });
    } catch (error) {
        console.error('Error loading menu:', error);
    } finally {
        hideLoading();
    }
}

// Handle reservation form submission
document.getElementById('reservationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoading();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const guests = Number(document.getElementById('guests').value);
    const date = new Date(document.getElementById('date').value).getTime() * 1000000; // Convert to nanoseconds

    try {
        const reservationCode = await backend.makeReservation(name, email, guests, date);
        
        if (reservationCode) {
            alert(`Reservation successful! Your code is: ${reservationCode}`);
        } else {
            alert('Sorry, we are fully booked for this date or no longer accepting reservations.');
        }
    } catch (error) {
        console.error('Error making reservation:', error);
        alert('Error making reservation. Please try again.');
    } finally {
        hideLoading();
    }
});

// Handle location form submission
document.getElementById('locationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoading();

    const code = document.getElementById('reservationCode').value;
    const locationResult = document.getElementById('locationResult');

    try {
        const location = await backend.getLocation(code);
        
        if (location) {
            locationResult.innerHTML = `<div class="alert alert-success">${location}</div>`;
        } else {
            locationResult.innerHTML = '<div class="alert alert-danger">Invalid reservation code.</div>';
        }
    } catch (error) {
        console.error('Error getting location:', error);
        locationResult.innerHTML = '<div class="alert alert-danger">Error retrieving location. Please try again.</div>';
    } finally {
        hideLoading();
    }
});

// Initialize page
window.addEventListener('load', async () => {
    await initCountdown();
    await loadMenu();
});
