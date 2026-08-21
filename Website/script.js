/**
 * OM MURUGA WATER SUPPLY - JavaScript Engine
 * Handles Navigation, Booking Validation, WhatsApp Auto-formatting, 
 * Animations, and Owner Reply Simulation.
 */

// ==========================================
// 1. CONFIGURATION & CONSTANTS
// ==========================================
// Centralized Owner Contact Settings (Easy to Edit)
const OWNER_WHATSAPP = "917395922095"; // 10-12 digit WhatsApp number with country code
const OWNER_PHONE = "+917395922095";

document.addEventListener("DOMContentLoaded", () => {
    
    // Set dynamic direct call and WhatsApp links
    updateContactLinks();

    // Set Minimum Date for Booking Field to Today
    setMinBookingDate();

    // Initialize Event Listeners
    initNavigation();
    initBookingForm();
    initCapacitySelection();
    initScrollEffects();
    initCounters();

});

// Update static contact placeholders dynamically
function updateContactLinks() {
    const phoneLinks = document.querySelectorAll('.phone-link');
    phoneLinks.forEach(link => {
        link.setAttribute('href', `tel:${OWNER_PHONE}`);
        if (link.innerText.startsWith('+91') || link.innerText.includes('73959')) {
            link.innerText = '+91 73959 22095';
        }
    });

    const waLinks = document.querySelectorAll('.wa-direct-link');
    waLinks.forEach(link => {
        link.setAttribute('href', `https://wa.me/${OWNER_WHATSAPP}`);
        if (link.innerText.startsWith('+91') || link.innerText.includes('73959')) {
            link.innerText = '+91 73959 22095';
        }
    });
}

// Ensure customer cannot pick dates in the past
function setMinBookingDate() {
    const dateInput = document.getElementById('deliveryDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
}

// ==========================================
// 2. NAVIGATION & MOBILE MENU
// ==========================================
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active Navigation Highlight on Scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ==========================================
// 3. BOOKING FORM & WHATSAPP INTEGRATION
// ==========================================
function initBookingForm() {
    const bookingForm = document.getElementById('waterBookingForm');

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Collect Form Inputs
            const name = document.getElementById('custName').value.trim();
            const phone = document.getElementById('custPhone').value.trim();
            const location = document.getElementById('custLocation').value.trim();
            const capacity = document.getElementById('tankerCapacity').value;
            const date = document.getElementById('deliveryDate').value;

            // Formatted Message Structure
            const waMessage = 
`*OM MURUGA WATER SUPPLY – NEW BOOKING*
----------------------------------------
👤 *Customer Name:* ${name}
📍 *Location:* ${location}
💧 *Tanker Capacity:* ${capacity}
📅 *Delivery Date:* ${date}
📞 *Contact Number:* ${phone}
----------------------------------------
Please confirm this order.`;

            // Encode for URI
            const encodedMessage = encodeURIComponent(waMessage);
            const waURL = `https://wa.me/${OWNER_WHATSAPP}?text=${encodedMessage}`;

            // 1. Simulate Confirmation on Website UI
            renderWhatsAppSimulation(name, capacity, location, date);

            // 2. Open WhatsApp in new tab / application
            setTimeout(() => {
                window.open(waURL, '_blank');
            }, 800);
        }
    });
}

// Validation Logic
function validateForm() {
    let isValid = true;

    // Name Validation
    const name = document.getElementById('custName');
    const errName = document.getElementById('err-name');
    if (!name.value.trim()) {
        showError(name, errName);
        isValid = false;
    } else {
        hideError(name, errName);
    }

    // Phone Validation
    const phone = document.getElementById('custPhone');
    const errPhone = document.getElementById('err-phone');
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone.value.trim())) {
        showError(phone, errPhone);
        isValid = false;
    } else {
        hideError(phone, errPhone);
    }

    // Location Validation
    const location = document.getElementById('custLocation');
    const errLocation = document.getElementById('err-location');
    if (!location.value.trim()) {
        showError(location, errLocation);
        isValid = false;
    } else {
        hideError(location, errLocation);
    }

    // Capacity Validation
    const capacity = document.getElementById('tankerCapacity');
    const errCapacity = document.getElementById('err-capacity');
    if (!capacity.value) {
        showError(capacity, errCapacity);
        isValid = false;
    } else {
        hideError(capacity, errCapacity);
    }

    // Date Validation
    const date = document.getElementById('deliveryDate');
    const errDate = document.getElementById('err-date');
    if (!date.value) {
        showError(date, errDate);
        isValid = false;
    } else {
        hideError(date, errDate);
    }

    return isValid;
}

function showError(input, errorEl) {
    input.classList.add('invalid');
    errorEl.classList.add('show');
}

function hideError(input, errorEl) {
    input.classList.remove('invalid');
    errorEl.classList.remove('show');
}

// ==========================================
// 4. WHATSAPP SIMULATION & REPLY LOGIC
// ==========================================
/**
 * Note for future WhatsApp API Integration:
 * The function below provides the UI feedback layer. When connecting a real 
 * WhatsApp Business API backend, webhooks can be hooked into this component.
 */
function renderWhatsAppSimulation(name, capacity, location, date) {
    const waChatBody = document.getElementById('waChatBody');
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Insert Outgoing Customer Order Message
    const outMsgHTML = `
        <div class="wa-msg wa-msg-out">
            <strong>Booking Request Sent:</strong><br>
            Tanker: ${capacity}<br>
            To: ${location}<br>
            Date: ${date}
            <div class="wa-time">${currentTime} <i class="fa-solid fa-check-double wa-ticks"></i></div>
        </div>
    `;

    waChatBody.innerHTML = outMsgHTML;

    // Simulate Automated Dispatch Confirmation Response after 1 second delay
    setTimeout(() => {
        const inMsgHTML = `
            <div class="wa-msg wa-msg-in">
                <strong>OM MURUGA WATER SUPPLY</strong><br>
                Okay! Your Order Is Taken. 💧🚚<br>
                Thank You For Ordering Om Muruga Water Supply.
                <div class="wa-time">${currentTime}</div>
            </div>
        `;
        waChatBody.innerHTML += inMsgHTML;
        waChatBody.scrollTop = waChatBody.scrollHeight;
    }, 1200);
}

// ==========================================
// 5. TANKER CAPACITY AUTO-SELECT & SCROLL
// ==========================================
function initCapacitySelection() {
    const selectButtons = document.querySelectorAll('.select-capacity-btn');
    const capacitySelect = document.getElementById('tankerCapacity');

    selectButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const chosenCapacity = e.target.getAttribute('data-capacity');
            
            if (capacitySelect) {
                capacitySelect.value = chosenCapacity;
            }

            // Smooth scroll to booking section
            const bookingSection = document.getElementById('booking');
            if (bookingSection) {
                bookingSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ==========================================
// 6. SCROLL EFFECTS & REVEAL ANIMATIONS
// ==========================================
function initScrollEffects() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    const progressBar = document.getElementById('scroll-progress');

    // Initial check for elements in viewport on page load
    revealOnScroll();

    window.addEventListener('scroll', () => {
        // Scroll Progress Bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) progressBar.style.width = scrolled + "%";

        // Back To Top Visibility
        if (winScroll > 400) {
            if (backToTopBtn) backToTopBtn.classList.add('show');
        } else {
            if (backToTopBtn) backToTopBtn.classList.remove('show');
        }

        // Trigger Reveal Elements
        revealOnScroll();
    });
}

function revealOnScroll() {
    const reveals = document.querySelectorAll('.fade-in, .slide-up');
    const windowHeight = window.innerHeight;

    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 100;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('reveal-active');
        }
    });
}

// ==========================================
// 7. ANIMATED COUNTERS
// ==========================================
function initCounters() {
    const counterNumbers = document.querySelectorAll('.counter-number');
    let started = false;

    window.addEventListener('scroll', () => {
        const counterSection = document.querySelector('.counters-container');
        if (!counterSection) return;

        const sectionTop = counterSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight - 50 && !started) {
            counterNumbers.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const speed = 200;

                const updateCount = () => {
                    const count = +counter.innerText;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 15);
                    } else {
                        counter.innerText = target.toLocaleString() + "+";
                    }
                };

                updateCount();
            });
            started = true;
        }
    });
}