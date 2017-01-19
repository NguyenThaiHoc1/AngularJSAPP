var trainingProgram = [
    {
        "id":"1",
        "name": "General Orientation",
        "Courses":[
            {
                "id": "101",
                "name": "Training Overview"
            },
            {
                "id": "102",
                "name": "DEK Organization and Culture"
            },
            {
                "id": "103",
                "name": "Our Customer Ericsson",
                "description": "1. Ericsson Vision and Core Values"
            },
            {
                "id": "104",
                "name": "IT Policy and Infrastructure"
            }
        ]
    },
    {
        "id":"2",
        "name": "Linux Programming",
        "description": "Description of Linux Programming",
        "Courses":[
            {
                "id": "201",
                "name": "Linux Programming Training Overview "
            },
            {
                "id": "203",
                "name": "Our Customer Ericsson"
            }
        ]
    }
];

var myEnrolledCourse = [
    {
        "id": "101",
        "name": "Training Overview "
    },
    {
        "id": "104",
        "name": "IT Policy and Infrastructure",
    },
    {
        "id": "203",
        "name": "Our Customer Ericsson",
    },
];

var openingCourse = [
    {
        "id":"102"
    },
    {
        "id":"104"
    }
]

trainingProgram.forEach(trainingProgram =>{
    trainingProgram.Courses.forEach(course=>{
        course.hideKey = false;
        course.isOpening = false;
    });
});

trainingProgram.forEach(trainingProgram=>{
    openingCourse.forEach(openingCourse=>{
        trainingProgram.Courses.forEach(function(courseElement, courseElementIndex, Courses){
            if(courseElement.id == openingCourse.id) Courses[courseElementIndex].isOpening = true;
        });
    });
});

trainingProgram.forEach(trainingProgram =>{
    console.log(trainingProgram.Courses)
});
