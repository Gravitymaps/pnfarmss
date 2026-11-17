// Create custom opacity slider instead of default one
            var customOpacityControl = L.Control.extend({
                options: {
                    position: 'topright'

                },
                
                onAdd: function(map) {
                    var container = L.DomUtil.create('div', 'custom-opacity-control');
                    
                    container.innerHTML = `
                        <i class="fas fa-adjust opacity-icon"></i>
                        <div class="custom-slider-container" id="opacitySliderContainer">
                            <div class="opacity-value" id="opacityValue">100%</div>
                            <div class="slider-track" id="sliderTrack"></div>
                            <div class="slider-thumb" id="sliderThumb">
                                <div class="slider-thumb-dot"></div>
                            </div>
                        </div>
                    `;
                    
                    // Prevent map events on this control
                    L.DomEvent.disableClickPropagation(container);
                    L.DomEvent.disableScrollPropagation(container);
                    
                    return container;
                },
                
                onRemove: function(map) {
                    // Clean up
                }
            });
            

            
            // Custom slider functionality
            setTimeout(function() {
                var sliderContainer = document.getElementById('opacitySliderContainer');
                var sliderTrack = document.getElementById('sliderTrack');
                var sliderThumb = document.getElementById('sliderThumb');
                var opacityValue = document.getElementById('opacityValue');
                var sliderThumbDot = sliderThumb.querySelector('.slider-thumb-dot');
                var currentOpacity = 1.0;
                var isDragging = false;

                function lerpColor(from, to, t) {
                    var a = parseInt(from.slice(1), 16), b = parseInt(to.slice(1), 16);
                    var ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255;
                    var br = (b >> 16) & 255, bg = (b >> 8) & 255, bb = b & 255;
                    var r = Math.round(ar + (br - ar) * t);
                    var g = Math.round(ag + (bg - ag) * t);
                    var bl = Math.round(ab + (bb - ab) * t);
                    return 'rgb(' + r + ',' + g + ',' + bl + ')';
                }

                function updateSlider(opacity) {
                    var percentage = opacity * 100;
                    var thumbPosition = (sliderContainer.offsetHeight - sliderThumb.offsetHeight) * (1 - opacity);
                    var accentColor = lerpColor('#2d8659', '#ff6b35', 1 - opacity);

                    sliderTrack.style.height = percentage + '%';
                    sliderThumb.style.top = thumbPosition + 'px';
                    sliderThumb.style.borderColor = accentColor;
                    sliderThumbDot.style.backgroundColor = accentColor;

                    opacityValue.textContent = Math.round(percentage) + '%';
                    opacityValue.style.top = (thumbPosition + sliderThumb.offsetHeight / 2) + 'px';
                    opacityValue.style.setProperty('--badge-color', accentColor);

  // Update layer opacity
                    if (layer_NavalFarms_2) {
                        layer_NavalFarms_2.setOpacity(opacity);
                    }


                }

                function getOpacityFromPosition(clientY) {
                    var rect = sliderContainer.getBoundingClientRect();
                    var y = clientY - rect.top;
                    var opacity = Math.max(0, Math.min(1, 1 - (y / rect.height)));
                    return opacity;
                }

                // Mouse events
                sliderContainer.addEventListener('mousedown', function(e) {
                    isDragging = true;
                    currentOpacity = getOpacityFromPosition(e.clientY);
                    updateSlider(currentOpacity);
                    e.preventDefault();
                });

                document.addEventListener('mousemove', function(e) {
                    if (isDragging) {
                        currentOpacity = getOpacityFromPosition(e.clientY);
                        updateSlider(currentOpacity);
                        e.preventDefault();
                    }
                });

                document.addEventListener('mouseup', function() {
                    isDragging = false;
                });

                // Touch events for mobile
                sliderContainer.addEventListener('touchstart', function(e) {
                    isDragging = true;
                    var touch = e.touches[0];
                    currentOpacity = getOpacityFromPosition(touch.clientY);
                    updateSlider(currentOpacity);
                    e.preventDefault();
                    e.stopPropagation();

                    // Disable map interactions
                    map.dragging.disable();
                    map.touchZoom.disable();
                    map.doubleClickZoom.disable();
                    map.scrollWheelZoom.disable();
                }, { passive: false });

                document.addEventListener('touchmove', function(e) {
                    if (isDragging) {
                        var touch = e.touches[0];
                        currentOpacity = getOpacityFromPosition(touch.clientY);
                        updateSlider(currentOpacity);
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }, { passive: false });
                
                document.addEventListener('touchend', function(e) {
                    if (isDragging) {
                        isDragging = false;
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Re-enable map interactions after a short delay
                        setTimeout(function() {
                            map.dragging.enable();
                            map.touchZoom.enable();
                            map.doubleClickZoom.enable();
                            map.scrollWheelZoom.enable();
                        }, 150);
                    }
                }, { passive: false });
                
                // Initialize slider
                updateSlider(currentOpacity);
                
            }, 500);