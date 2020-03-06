(function (){
    function Question(question, answers, correct){
        this.question = question;
        this.answers = answers;
        this.correct = correct;
    }
    
    Question.prototype.displayQuestion = function() {
        console.log(this.question);
        for (let i = 0; i < this.answers.length; i++){
            console.log(i + ': '+ this.answers[i]);
        }
    }
    
    Question.prototype.checkAnswer = function(ans) {
        if (ans === this.correct){
            console.log('Correct answer!');
        }else{
            console.log('Wrong answer! Try again.');
    
        }
    }
    
    let q1 = new Question('Is JavaScript the coolest programming language in the world?', 
    ['Yes', 'No'], 0);
    let q2 = new Question('What is my name?', ['Nick', 'Maks', 'John'], 1);
    let q3 = new Question('Which year is now?', [2017, 1839, 2020], 2);
    let q4 = new Question('Are you working in Teymax?', ['Yes', 'No'], 0);
    
    let questions = [q1, q2, q3, q4];
    
    let n = Math.floor(Math.random() * Math.floor(questions.length));
    
    questions[n].displayQuestion();
    
    let answer = parseInt(prompt('Please select the correct answer.'));
    
    questions[n].checkAnswer(answer);
})();