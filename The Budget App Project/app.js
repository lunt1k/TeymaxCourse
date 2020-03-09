let budgetController = (function() {
    let Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercantage = function(totalIncome) {
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }else{
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    let Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let calculateTotal = function(type) {
        let sum = 0;
        data.allItems[type].forEach(element => {
            sum += element.value;
        });
        data.totals[type] = sum;
    };

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0, 
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, desc, val) {
            let newItem, ID;

            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }
            if (type === 'exp'){
                newItem = new Expense(ID, desc, val);
            }else if(type === 'inc'){
                newItem = new Income(ID, desc, val);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },
        deleteItem: function(type, id) {
            let ids, index;
            ids = data.allItems[type].map(current => {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },
        calculateBudget: function() {
            calculateTotal('exp');
            calculateTotal('inc');

            data.budget = data.totals.inc - data.totals.exp;
            if (data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }else{
                data.percentage = -1;
            }
        },
        calculatePercantages: function() {
            data.allItems.exp.forEach(cur => {
                cur.calcPercantage(data.totals.inc);
            })
        },
        getPercentages: function() {
            let AllPerc = data.allItems.exp.map(cur => {
                return cur.getPercentage();
            });
            return AllPerc;
        },
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        testing: function() {
            console.log(data);
        }
    };
})();

let UIController = (function() {

    let DOMStrings = {
        inputType: '.add__type', 
        inputDescription: '.add__description', 
        inputValue: '.add__value',
        inputBtn: '.add__btn', 
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    }

    let formatNumber = function(num, type){
        let numSplit, int, dec, sign;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        
        if (int.length > 3){
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        dec = numSplit[1];

        
        return (type === 'exp' ? sign = '-' : sign = '+') + ' ' + int + '.' + dec;
    };

    let nodeListforEach = function(list, callback){
        for(let i = 0; i < list.length; i++){
            callback(list[i], i);
        }
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }; 
        }, 
        addListItems: function(obj, type) {
            let html, newHtml, element;

            if (type === 'inc'){
                element = DOMStrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if (type === 'exp'){
                element = DOMStrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value));
            
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        deleteListItem: function(selectorID) {
            let el = document.getElementById(selectorID)
            el.parentNode.removeChild(el);
        },
        clearFields: function() {
            let fields, fieldsArray;

            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue)
            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach((current, index, array) => {
                current.value = '';
            });

            fieldsArray[0].focus();
        },
        displayBudget: function(obj) {
            let type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if (obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            }else{
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
        },
        displayPercantages: function(percentages) {
            let fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
            
            nodeListforEach(fields, function(current, index) {
                if (percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                }else {
                    current.textContent = '---';
                }
            });
        },
        displayMonth: function() {
            let month, now, year, months;
            now = new Date();

            months = ['January', 'February', 'March', 'April', 'May', 'June',  'July', 'August', 'September', 'October', 'Novemeber', 'December'];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' + ' + year;
        },
        changedType: function() {
            let fields = document.querySelectorAll(DOMStrings.inputType + ',' + DOMStrings.inputDescription + ',' + DOMStrings.inputValue);

            nodeListforEach(fields, cur => {
                cur.classList.toggle('red-focus');
            });
            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        },
        getDOMStrings: function() {
            return DOMStrings;
        }
    };


})();

let controller = (function(budgetCtrl, UICtrl){

    let setupEventListeners = function() {
        let DOM = UICtrl.getDOMStrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    

    let ctrlAddItem = function() {
        let newItem, input;

        input = UICtrl.getInput();
        if (input.description !== '' && !isNaN(input.value) && input.value > 0){
            newItem = budgetController.addItem(input.type, input.description, input.value);

            UICtrl.addListItems(newItem, input.type);
    
            UICtrl.clearFields();
    
            updateBudget();

            updatePercentages();
        }
    };

    let ctrlDeleteItem = function(event) {
        let itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            budgetCtrl.deleteItem(type, ID);

            UICtrl.deleteListItem(itemID);

            updateBudget();
        }
        
    };


    let updateBudget = function() {
        budgetCtrl.calculateBudget();

        let budget = budgetCtrl.getBudget();

        UICtrl.displayBudget(budget);
    }

    let updatePercentages = function() {    
        budgetCtrl.calculatePercantages();

        let percentages = budgetCtrl.getPercentages();

        UICtrl.displayPercantages(percentages);
    }
    return {
        init: function() {
            console.log('Application has started');
            setupEventListeners();
            UICtrl.displayMonth();
            UICtrl.displayBudget({budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0});
        }
    }

})(budgetController, UIController);

controller.init();