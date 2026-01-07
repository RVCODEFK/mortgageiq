/**
 * MortgageIQ - Advanced Mortgage Calculator Engine
 * Professional-grade mortgage calculation with amortization schedule
 */

class MortgageCalculator {
    constructor() {
        this.homePrice = 350000;
        this.downPayment = 70000;
        this.loanAmount = 280000;
        this.interestRate = 6.5;
        this.loanTerm = 30;
        
        this.monthlyPayment = 0;
        this.totalPayments = 0;
        this.totalInterest = 0;
        this.totalCost = 0;
        this.amortizationSchedule = [];
        this.isShowingFullSchedule = false;
        
        this.initElements();
        this.bindEvents();
        this.updateLoanAmount();
    }

    /**
     * Initialize DOM elements
     */
    initElements() {
        this.elements = {
            // Inputs
            homePrice: document.getElementById('homePrice'),
            homePriceSlider: document.getElementById('homePriceSlider'),
            downPayment: document.getElementById('downPayment'),
            downPaymentSlider: document.getElementById('downPaymentSlider'),
            downPaymentPercent: document.getElementById('downPaymentPercent'),
            loanAmount: document.getElementById('loanAmount'),
            interestRate: document.getElementById('interestRate'),
            loanTerm: document.getElementById('loanTerm'),
            calculateBtn: document.getElementById('calculateBtn'),
            
            // Results
            resultsPanel: document.getElementById('resultsPanel'),
            monthlyPayment: document.getElementById('monthlyPayment'),
            termMonths: document.getElementById('termMonths'),
            termYears: document.getElementById('termYears'),
            resultLoan: document.getElementById('resultLoan'),
            totalPayments: document.getElementById('totalPayments'),
            totalInterest: document.getElementById('totalInterest'),
            totalCost: document.getElementById('totalCost'),
            barPrincipal: document.getElementById('barPrincipal'),
            barInterest: document.getElementById('barInterest'),
            principalAmount: document.getElementById('principalAmount'),
            principalPercent: document.getElementById('principalPercent'),
            interestAmount: document.getElementById('interestAmount'),
            interestPercent: document.getElementById('interestPercent'),
            
            // Amortization
            toggleAmortization: document.getElementById('toggleAmortization'),
            amortizationTable: document.getElementById('amortizationTable'),
            amortizationBody: document.getElementById('amortizationBody'),
            viewFullSchedule: document.getElementById('viewFullSchedule'),
            downloadSchedule: document.getElementById('downloadSchedule'),
            
            // Actions
            resetBtn: document.getElementById('resetBtn'),
            shareBtn: document.getElementById('shareBtn'),
            emailResults: document.getElementById('emailResults'),
            
            // Layout
            calculatorLayout: document.querySelector('.calculator-layout')
        };
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Price input and slider sync
        this.elements.homePrice.addEventListener('input', (e) => {
            const value = CurrencyManager.parse(e.target.value);
            this.homePrice = value;
            this.elements.homePriceSlider.value = value;
            this.updateLoanAmount();
            this.formatInput(e.target);
        });

        this.elements.homePriceSlider.addEventListener('input', (e) => {
            this.homePrice = parseFloat(e.target.value);
            this.elements.homePrice.value = CurrencyManager.format(this.homePrice);
            this.updateLoanAmount();
        });

        // Down payment input and slider sync
        this.elements.downPayment.addEventListener('input', (e) => {
            const value = CurrencyManager.parse(e.target.value);
            this.downPayment = Math.min(value, this.homePrice);
            this.elements.downPaymentSlider.value = this.downPayment;
            this.updateLoanAmount();
            this.formatInput(e.target);
        });

        this.elements.downPaymentSlider.addEventListener('input', (e) => {
            this.downPayment = parseFloat(e.target.value);
            this.elements.downPayment.value = CurrencyManager.format(this.downPayment);
            this.updateLoanAmount();
        });

        // Interest rate
        this.elements.interestRate.addEventListener('input', (e) => {
            this.interestRate = parseFloat(e.target.value);
        });

        // Loan term
        this.elements.loanTerm.addEventListener('input', (e) => {
            this.loanTerm = parseFloat(e.target.value);
        });

        // Calculate button
        this.elements.calculateBtn.addEventListener('click', () => {
            this.calculate();
        });

        // Enter key to calculate
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.calculate();
            }
        });

        // Reset button
        if (this.elements.resetBtn) {
            this.elements.resetBtn.addEventListener('click', () => {
                this.reset();
            });
        }

        // Share button
        if (this.elements.shareBtn) {
            this.elements.shareBtn.addEventListener('click', () => {
                this.share();
            });
        }

        // Email results button
        if (this.elements.emailResults) {
            this.elements.emailResults.addEventListener('click', () => {
                this.emailResults();
            });
        }

        // Toggle amortization table
        if (this.elements.toggleAmortization) {
            this.elements.toggleAmortization.addEventListener('click', () => {
                this.toggleAmortizationTable();
            });
        }

        // View full schedule button
        if (this.elements.viewFullSchedule) {
            this.elements.viewFullSchedule.addEventListener('click', () => {
                this.viewFullSchedule();
            });
        }

        // Download schedule
        if (this.elements.downloadSchedule) {
            this.elements.downloadSchedule.addEventListener('click', () => {
                this.downloadSchedule();
            });
        }

        // Format inputs on blur
        ['homePrice', 'downPayment'].forEach(field => {
            this.elements[field].addEventListener('blur', (e) => {
                this.formatInput(e.target);
            });

            this.elements[field].addEventListener('focus', (e) => {
                const value = CurrencyManager.parse(e.target.value);
                e.target.value = value;
                e.target.select();
            });
        });
    }

    /**
     * Format input field with currency formatting
     */
    formatInput(input) {
        const value = CurrencyManager.parse(input.value);
        input.value = CurrencyManager.format(value);
    }

    /**
     * Update loan amount and percentage
     */
    updateLoanAmount() {
        this.loanAmount = Math.max(0, this.homePrice - this.downPayment);
        this.elements.loanAmount.value = CurrencyManager.format(this.loanAmount);
        
        if (this.homePrice > 0) {
            const percent = (this.downPayment / this.homePrice * 100);
            this.elements.downPaymentPercent.textContent = percent.toFixed(1) + '%';
        } else {
            this.elements.downPaymentPercent.textContent = '0.0%';
        }
        
        this.elements.downPaymentSlider.max = this.homePrice;
    }

    /**
     * Validate inputs before calculation
     */
    validate() {
        const errors = [];

        if (this.homePrice <= 0) {
            errors.push('Home price must be greater than 0');
        }

        if (this.downPayment < 0) {
            errors.push('Down payment cannot be negative');
        }

        if (this.downPayment >= this.homePrice) {
            errors.push('Down payment must be less than home price');
        }

        if (this.loanAmount <= 0) {
            errors.push('Loan amount must be greater than 0');
        }

        if (this.interestRate < 0 || this.interestRate > 20) {
            errors.push('Interest rate must be between 0% and 20%');
        }

        if (this.loanTerm < 1 || this.loanTerm > 40) {
            errors.push('Loan term must be between 1 and 40 years');
        }

        if (errors.length > 0) {
            this.showError(errors.join('\n'));
            return false;
        }

        return true;
    }

    /**
     * Show error message
     */
    showError(message) {
        alert('❌ Validation Error:\n\n' + message);
    }

    /**
     * Calculate mortgage
     */
    calculate() {
        if (!this.validate()) {
            return;
        }

        const P = this.loanAmount;
        const annualRate = this.interestRate;
        const years = this.loanTerm;
        
        const r = annualRate / 100 / 12;
        const n = years * 12;
        
        let M;
        if (r === 0) {
            M = P / n;
        } else {
            M = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        }
        
        this.monthlyPayment = M;
        this.totalPayments = M * n;
        this.totalInterest = this.totalPayments - P;
        this.totalCost = this.totalPayments + this.downPayment;
        
        this.generateAmortizationSchedule();
        this.displayResults();
        this.logCalculation();
    }

    /**
     * Generate amortization schedule
     */
    generateAmortizationSchedule() {
        this.amortizationSchedule = [];
        
        const P = this.loanAmount;
        const r = this.interestRate / 100 / 12;
        const n = this.loanTerm * 12;
        const M = this.monthlyPayment;
        
        let remainingBalance = P;
        
        for (let month = 1; month <= n; month++) {
            const interestPayment = remainingBalance * r;
            const principalPayment = M - interestPayment;
            remainingBalance -= principalPayment;
            
            if (remainingBalance < 0) remainingBalance = 0;
            
            this.amortizationSchedule.push({
                month: month,
                payment: M,
                principal: principalPayment,
                interest: interestPayment,
                balance: remainingBalance
            });
        }
    }

    /**
     * Display calculation results
     */
    displayResults() {
        this.elements.calculatorLayout?.classList.add('show-results');

        this.elements.monthlyPayment.textContent = CurrencyManager.format(this.monthlyPayment);
        this.elements.termMonths.textContent = (this.loanTerm * 12);
        this.elements.termYears.textContent = this.loanTerm;
        
        this.elements.resultLoan.textContent = CurrencyManager.format(this.loanAmount);
        this.elements.totalPayments.textContent = CurrencyManager.format(this.totalPayments);
        this.elements.totalInterest.textContent = CurrencyManager.format(this.totalInterest);
        this.elements.totalCost.textContent = CurrencyManager.format(this.totalCost);
        
        const principalPercent = (this.loanAmount / this.totalPayments * 100);
        const interestPercent = (this.totalInterest / this.totalPayments * 100);
        
        this.elements.barPrincipal.style.width = principalPercent + '%';
        this.elements.barInterest.style.width = interestPercent + '%';
        
        const principalLabel = this.elements.barPrincipal.querySelector('.bar-label');
        const interestLabel = this.elements.barInterest.querySelector('.bar-label');
        
        if (principalLabel) {
            principalLabel.textContent = principalPercent > 15 ? principalPercent.toFixed(1) + '%' : '';
        }
        if (interestLabel) {
            interestLabel.textContent = interestPercent > 15 ? interestPercent.toFixed(1) + '%' : '';
        }
        
        this.elements.principalAmount.textContent = CurrencyManager.format(this.loanAmount);
        this.elements.principalPercent.textContent = principalPercent.toFixed(1);
        this.elements.interestAmount.textContent = CurrencyManager.format(this.totalInterest);
        this.elements.interestPercent.textContent = interestPercent.toFixed(1);
        
        this.elements.resultsPanel.classList.remove('hidden');
        
        if (window.innerWidth < 1024) {
            setTimeout(() => {
                this.elements.resultsPanel.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 300);
        }
    }

    /**
     * Toggle amortization table
     */
    toggleAmortizationTable() {
        const table = this.elements.amortizationTable;
        const button = this.elements.toggleAmortization;
        
        if (!table || !button) return;
        
        if (table.classList.contains('hidden')) {
            this.renderAmortizationTable();
            table.classList.remove('hidden');
            button.classList.add('active');
            button.querySelector('span').textContent = 'Hide Schedule';
        } else {
            table.classList.add('hidden');
            button.classList.remove('active');
            button.querySelector('span').textContent = 'Show Schedule';
        }
    }

    /**
     * Render amortization table (optimized - summary view)
     */
    renderAmortizationTable() {
        const tbody = this.elements.amortizationBody;
        tbody.innerHTML = '';
        
        if (this.amortizationSchedule.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No data available</td></tr>';
            return;
        }
        
        // Show first 12 months
        for (let i = 0; i < Math.min(12, this.amortizationSchedule.length); i++) {
            this.addAmortizationRow(tbody, this.amortizationSchedule[i], false);
        }
        
        // Show yearly summaries
        for (let year = 2; year <= this.loanTerm; year++) {
            const monthIndex = (year * 12) - 1;
            if (monthIndex < this.amortizationSchedule.length) {
                const row = this.amortizationSchedule[monthIndex];
                this.addAmortizationRow(tbody, row, true);
            }
        }
        
        this.isShowingFullSchedule = false;
        this.updateViewButton();
    }

    /**
     * Add row to amortization table
     */
    addAmortizationRow(tbody, row, isYearEnd) {
        const tr = document.createElement('tr');
        
        if (isYearEnd) {
            tr.style.fontWeight = '700';
            tr.style.backgroundColor = 'var(--primary-50)';
        }
        
        tr.innerHTML = `
            <td>${isYearEnd ? `Year ${Math.ceil(row.month / 12)}` : `Month ${row.month}`}</td>
            <td>${CurrencyManager.currentSymbol}${this.formatNumber(row.payment)}</td>
            <td>${CurrencyManager.currentSymbol}${this.formatNumber(row.principal)}</td>
            <td>${CurrencyManager.currentSymbol}${this.formatNumber(row.interest)}</td>
            <td>${CurrencyManager.currentSymbol}${this.formatNumber(row.balance)}</td>
        `;
        
        tbody.appendChild(tr);
    }

    /**
     * Format number for display
     */
    formatNumber(num) {
        return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    /**
     * View full schedule (all months)
     */
    viewFullSchedule() {
        const tbody = this.elements.amortizationBody;
        
        if (this.isShowingFullSchedule) {
            // Back to summary
            this.renderAmortizationTable();
        } else {
            // Show all months
            tbody.innerHTML = '';
            this.amortizationSchedule.forEach((row, index) => {
                const isYearEnd = (index + 1) % 12 === 0;
                this.addAmortizationRow(tbody, row, isYearEnd);
            });
            this.isShowingFullSchedule = true;
            this.updateViewButton();
        }
    }

    /**
     * Update view button text
     */
    updateViewButton() {
        const button = this.elements.viewFullSchedule;
        if (!button) return;
        
        if (this.isShowingFullSchedule) {
            button.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="17 11 12 6 7 11"/>
                    <polyline points="17 18 12 13 7 18"/>
                </svg>
                Show Summary
            `;
        } else {
            button.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="7 13 12 18 17 13"/>
                    <polyline points="7 6 12 11 17 6"/>
                </svg>
                View All Months
            `;
        }
    }

    /**
     * Download schedule as CSV
     */
    downloadSchedule() {
        if (this.amortizationSchedule.length === 0) {
            alert('Please calculate mortgage first');
            return;
        }
        
        let csv = 'Month,Payment,Principal,Interest,Balance\n';
        
        this.amortizationSchedule.forEach(row => {
            csv += `${row.month},${row.payment.toFixed(2)},${row.principal.toFixed(2)},${row.interest.toFixed(2)},${row.balance.toFixed(2)}\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `MortgageIQ_Amortization_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    /**
     * Email results
     */
    emailResults() {
        if (this.monthlyPayment === 0) {
            alert('Please calculate mortgage first');
            return;
        }
        
        const subject = 'My Mortgage Calculation from MortgageIQ';
        const body = `Mortgage Calculation Results:\n\n` +
            `Home Price: ${CurrencyManager.currentSymbol}${CurrencyManager.format(this.homePrice)}\n` +
            `Down Payment: ${CurrencyManager.currentSymbol}${CurrencyManager.format(this.downPayment)}\n` +
            `Loan Amount: ${CurrencyManager.currentSymbol}${CurrencyManager.format(this.loanAmount)}\n` +
            `Interest Rate: ${this.interestRate}%\n` +
            `Loan Term: ${this.loanTerm} years\n\n` +
            `Monthly Payment: ${CurrencyManager.currentSymbol}${CurrencyManager.format(this.monthlyPayment)}\n` +
            `Total Interest: ${CurrencyManager.currentSymbol}${CurrencyManager.format(this.totalInterest)}\n` +
            `Total Paid: ${CurrencyManager.currentSymbol}${CurrencyManager.format(this.totalPayments)}\n\n` +
            `Calculated with MortgageIQ\n${window.location.href}`;
        
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    /**
     * Reset calculator
     */
    reset() {
        this.elements.calculatorLayout?.classList.remove('show-results');

        this.homePrice = 350000;
        this.downPayment = 70000;
        this.interestRate = 6.5;
        this.loanTerm = 30;
        
        this.elements.homePrice.value = CurrencyManager.format(this.homePrice);
        this.elements.homePriceSlider.value = this.homePrice;
        this.elements.downPayment.value = CurrencyManager.format(this.downPayment);
        this.elements.downPaymentSlider.value = this.downPayment;
        this.elements.interestRate.value = this.interestRate;
        this.elements.loanTerm.value = this.loanTerm;
        
        this.updateLoanAmount();
        this.elements.resultsPanel.classList.add('hidden');
        
        if (this.elements.amortizationTable && !this.elements.amortizationTable.classList.contains('hidden')) {
            this.toggleAmortizationTable();
        }
        
        this.amortizationSchedule = [];
        if (this.elements.amortizationBody) {
            this.elements.amortizationBody.innerHTML = '';
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Share results
     */
    share() {
        if (this.monthlyPayment === 0) {
            alert('Please calculate mortgage first');
            return;
        }
        
        const shareText = `🏡 Mortgage Calculation:\n\n` +
            `Home Price: ${CurrencyManager.currentSymbol}${CurrencyManager.format(this.homePrice)}\n` +
            `Down Payment: ${CurrencyManager.currentSymbol}${CurrencyManager.format(this.downPayment)}\n` +
            `Interest Rate: ${this.interestRate}%\n` +
            `Term: ${this.loanTerm} years\n\n` +
            `💰 Monthly Payment: ${CurrencyManager.currentSymbol}${CurrencyManager.format(this.monthlyPayment)}\n\n` +
            `Calculated with MortgageIQ`;
        
        if (navigator.share) {
            navigator.share({
                title: 'MortgageIQ Calculation',
                text: shareText,
                url: window.location.href
            }).catch((error) => {
                if (error.name !== 'AbortError') {
                    console.log('Error sharing:', error);
                }
            });
        } else {
            navigator.clipboard.writeText(shareText + '\n\n' + window.location.href).then(() => {
                alert('✅ Results copied to clipboard!');
            }).catch((error) => {
                console.error('Copy failed:', error);
                alert('Unable to copy. Please try again.');
            });
        }
    }

    /**
     * Log calculation
     */
    logCalculation() {
        const data = {
            timestamp: new Date().toISOString(),
            currency: CurrencyManager.currentCurrency,
            homePrice: this.homePrice,
            downPayment: this.downPayment,
            loanAmount: this.loanAmount,
            interestRate: this.interestRate,
            loanTerm: this.loanTerm,
            monthlyPayment: this.monthlyPayment,
            totalInterest: this.totalInterest
        };
        
        console.log('💰 Mortgage Calculation:', data);
    }
}

// Initialize calculator when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.calculator = new MortgageCalculator();
    });
} else {
    window.calculator = new MortgageCalculator();
}
