// Popup Functions
            function closePopup() {
                const overlay = document.getElementById('popupOverlay');
                overlay.classList.add('fade-out');
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, 300);
            }
            
            // Auto-close popup after 10 seconds (optional)
            setTimeout(() => {
                const overlay = document.getElementById('popupOverlay');
                if (overlay && !overlay.classList.contains('fade-out')) {
                    closePopup();
                }
            }, 10000);
            
            // Close popup when clicking outside the content
            document.getElementById('popupOverlay').addEventListener('click', function(e) {
                if (e.target === this) {
                    closePopup();
                }
            });
            
            // Close popup with Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closePopup();
                }
            });
            