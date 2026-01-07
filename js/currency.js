/**
 * MortgageIQ - Currency Management System
 * Handles multi-currency support with symbols and formatting
 */

const CurrencyManager = {
    currencies: {
        USD: { symbol: '$', name: 'US Dollar', locale: 'en-US' },
        EUR: { symbol: '€', name: 'Euro', locale: 'de-DE' },
        GBP: { symbol: '£', name: 'British Pound', locale: 'en-GB' },
        JPY: { symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP', decimals: 0 },
        CAD: { symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
        AUD: { symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
        CHF: { symbol: 'Fr', name: 'Swiss Franc', locale: 'de-CH' },
        MXN: { symbol: '$', name: 'Mexican Peso', locale: 'es-MX' },
        COP: { symbol: '$', name: 'Colombian Peso', locale: 'es-CO', decimals: 0 },
        ARS: { symbol: '$', name: 'Argentine Peso', locale: 'es-AR' },
        CLP: { symbol: '$', name: 'Chilean Peso', locale: 'es-CL', decimals: 0 },
        BRL: { symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR' }
    },

    currentCurrency: 'USD',
    
    /**
     * Get current currency symbol (convenience property)
     */
    get currentSymbol() {
        return this.currencies[this.currentCurrency].symbol;
    },

    /**
     * Get current currency symbol
     */
    getSymbol() {
        return this.currencies[this.currentCurrency].symbol;
    },

    /**
     * Get currency configuration
     */
    getCurrency() {
        return this.currencies[this.currentCurrency];
    },

    /**
     * Set active currency
     */
    setCurrency(code) {
        if (this.currencies[code]) {
            this.currentCurrency = code;
            this.updateAllSymbols();
            return true;
        }
        return false;
    },

    /**
     * Format number with currency
     */
    format(number, includeSymbol = false) {
        const currency = this.getCurrency();
        const decimals = currency.decimals !== undefined ? currency.decimals : 2;
        
        // Handle invalid numbers
        if (isNaN(number) || number === null || number === undefined) {
            return '0';
        }
        
        // Format number with appropriate decimals
        const formatted = Math.abs(number).toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
        
        return includeSymbol ? `${currency.symbol}${formatted}` : formatted;
    },

    /**
     * Parse formatted string to number
     */
    parse(str) {
        if (typeof str === 'number') return str;
        if (!str) return 0;
        
        // Remove all non-numeric characters except decimal point and minus
        const cleaned = String(str).replace(/[^\d.-]/g, '');
        const parsed = parseFloat(cleaned);
        
        return isNaN(parsed) ? 0 : parsed;
    },

    /**
     * Update all currency symbols in the DOM
     */
    updateAllSymbols() {
        const symbol = this.getSymbol();
        const symbolElements = document.querySelectorAll('[id^="currencySymbol"]');
        const resultCurrency = document.getElementById('resultCurrency');
        
        symbolElements.forEach(el => {
            el.textContent = symbol;
        });
        
        if (resultCurrency) {
            resultCurrency.textContent = symbol;
        }
        
        // Trigger table re-render if it's visible
        const amortizationBody = document.getElementById('amortizationBody');
        if (amortizationBody && amortizationBody.children.length > 0) {
            // Re-render table with new currency
            if (window.calculator && window.calculator.amortizationSchedule.length > 0) {
                if (window.calculator.isShowingFullSchedule) {
                    window.calculator.viewFullSchedule();
                    window.calculator.viewFullSchedule(); // Toggle twice to refresh
                } else {
                    window.calculator.renderAmortizationTable();
                }
            }
        }
    },

    /**
     * Initialize currency system
     */
    init() {
        const currencySelect = document.getElementById('currency');
        
        if (currencySelect) {
            currencySelect.addEventListener('change', (e) => {
                this.setCurrency(e.target.value);
                
                // Trigger recalculation if results are visible
                const resultsPanel = document.getElementById('resultsPanel');
                if (resultsPanel && !resultsPanel.classList.contains('hidden')) {
                    const calculateBtn = document.getElementById('calculateBtn');
                    if (calculateBtn) {
                        calculateBtn.click();
                    }
                }
            });
        }
        
        // Initialize symbols
        this.updateAllSymbols();
        
        console.log('✅ CurrencyManager initialized');
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        CurrencyManager.init();
    });
} else {
    CurrencyManager.init();
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CurrencyManager;
}
