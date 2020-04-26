var firebaseConfig = {
    apiKey: "AIzaSyDNMLE5tch5dd--Eg1ePHLQThAPmFnBgIQ",
    authDomain: "rehash-handbook-3.firebaseapp.com",
    databaseURL: "https://rehash-handbook-3.firebaseio.com",
    projectId: "rehash-handbook-3",
    storageBucket: "rehash-handbook-3.appspot.com",
    messagingSenderId: "560410016193",
    appId: "1:560410016193:web:f0b50c34deb67dafc05740"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);




var app = angular.module("myApp", ['ngMaterial', 'ngSanitize', 'ngRoute', 'ngAnimate']);

// Creating New Service
app.config(function($routeProvider, $locationProvider) { //inject $locationProvider service
    $locationProvider.hashPrefix(''); // add configuration
    $routeProvider
        .when("/home", {
            templateUrl: "subject_list.html",
            controller: "chapterListController"
        })
        .when("/chapter/:chapterName", {
            templateUrl: "show_orders.html",
            controller: "myCtrl"
        })
        .when("/technologies", {
            template: "<h2>Welcome in Rehash Handbook</h2>"
        });
})
app.service("sampleService", function() {

    this.branchName = ''
    this.subjectName = ''
    this.chapterName = ''
});

app.controller('HomeController', function($scope) {
    $scope.message = 'Hello from HomeController';
});

app.controller('BlogController', function($scope) {
    $scope.message = 'Hello from BlogController';
});

app.controller('AboutController', function($scope) {
    $scope.message = 'Hello from AboutController';
});


app.controller('MyController', function($scope, $mdSidenav, $mdDialog, sampleService, $location) {
        $location.path('/technologies');
        $scope.status = ' ashraf ';
        $scope.cardList = ['ashraf', 'firdous'];

        $scope.openLeftMenu = function() {
            $mdSidenav('left').toggle();

        };
        $scope.isVisible = true;

        $scope.openRightMenu = function() {
            $mdSidenav('right').toggle();
        };



        $scope.showPrompt = function(ev) {


            if ($scope.isVisible == false) {
                $scope.isVisible = true;
            } else {
                $scope.isVisible = false;
            }

            // Appending dialog to document.body to cover sidenav in docs app



        };




    })
    .controller('subjectListController', function($scope, sampleService, $location) {
        $scope.selectedIndex = null;

        $scope.list = [];




        var subjectListRef = firebase.database().ref().child('app').child('subjectlist');



        subjectListRef.on('child_added', function(data) {
            $scope.$apply(function() {
                $scope.list.push(data.child("sname").val());
            });
        });

        $scope.displayItem = function(index, item) {


            sampleService.subjectName = item;
            $location.path('/home');


            if ($scope.selectedIndex === null) {
                $scope.selectedIndex = index;
            } else if ($scope.selectedIndex === index) {
                $scope.selectedIndex = null;
            } else {
                $scope.selectedIndex = index;
            }
        }

        $scope.sampleService = sampleService;
        $scope.branchName = sampleService.branchName;
        $scope.$watch('sampleService.branchName', function(newVal, oldVal, scope) {
            if (newVal) {
                scope.branchName = newVal;

                scope.list.length = 0;

                var subjectListRef1 = firebase.database().ref().child('app').child('subjectlist');
                subjectListRef1.orderByChild("branch").equalTo(newVal).on("child_added", function(snapshot) {
                    console.log(snapshot.child('sname').val());

                    $scope.list.push(snapshot.child("sname").val());

                });


            }
        });
    })
    .controller('branchSelectController', function($scope, sampleService) {

        var commentsRef = firebase.database().ref().child('app').child('branchlist');

        $scope.items = [];

        commentsRef.on('child_added', function(data) {
            $scope.$apply(function() {
                $scope.items.push(data.val());
            });
        });



        $scope.selectedItem = undefined;

        $scope.getSelectedText = function() {
            if ($scope.selectedItem !== undefined) {
                return $scope.selectedItem;
            } else {
                return "Please select an Branch";
            }
        };
        $scope.selectChanged = function(selectedItem) {
            sampleService.branchName = selectedItem;


        };
    })
    .controller('AppCtrl', function($scope) {})
    .controller("myCtrl", function($scope, sampleService, $location, $routeParams, $sce) {

        $scope.chapterListNew = [];
        $scope.sampleService = sampleService;
        $scope.chapterName = sampleService.chapterName;
        $scope.subjectName = sampleService.subjectName;
        $scope.myText = "<h2>demo</h2>";


        $scope.$watch('sampleService.chapterName', function(newVal, oldVal, scope, ) {
            if (newVal) {

                scope.chapterListNew.length = 0;
                var subjectListRef1 = firebase.database().ref().child('app').child('chapterlist');
                subjectListRef1.orderByChild("cname").equalTo(newVal).on("child_added", function(snapshot) {

                    $scope.chapterListNew.push(snapshot.child("html").val());
                    var htmlNew = $scope.chapterListNew[0];
                    var $div = $('<div>').html(htmlNew);
                    // modify attributes


                    $div.find('img').each(function() {
                        $(this).attr("id", this.src.substring(34));



                    });
                    $scope.myText = $sce.trustAsHtml($div.html());










                    // Get a reference to the storage service, which is used to create references in your storage bucket

                    var storage = firebase.storage();

                    // Create a storage reference from our storage service
                    var storageRef = storage.ref();



                    // Now we get the references of these images
                    storageRef.child($scope.subjectName + '/').listAll().then(function(result) {
                        result.items.forEach(function(imageRef) {

                            imageRef.getDownloadURL().then(function(url) {

                                // TODO: Display the image on the UI
                                $scope.$apply(function() {

                                    $div.find('img[id="' + imageRef.name + '"]').attr('src', url);


                                    $scope.myText = $sce.trustAsHtml($div.html());
                                    var html = document.getElementById("chapterContent");
                                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, html]);



                                });





                            }).catch(function(error) {
                                // Handle any errors
                            });


                        });




                    }).catch(function(error) {
                        // Handle any errors
                    });



                });

            }

        });



    })
    .controller("chapterListController", function($scope, sampleService, $location) {
        $scope.chapterList = [];
        $scope.sampleService = sampleService;
        $scope.subjectName = sampleService.subjectName;
        $scope.selectedChapterIndex = null;


        $scope.$watch('sampleService.subjectName', function(newVal, oldVal, scope) {
            if (newVal) {

                scope.chapterList.length = 0;
                var subjectListRef1 = firebase.database().ref().child('app').child('chapterlist');
                subjectListRef1.orderByChild("sname").equalTo(newVal).on("child_added", function(snapshot) {

                    $scope.chapterList.push(snapshot.child("cname").val());

                });

            }

        });

        $scope.displayChapter = function(index, item1) {


            sampleService.chapterName = item1;
            $location.path("/chapter/" + item1);


            if ($scope.selectedChapterIndex === null) {
                $scope.selectedChapterIndex = index;
            } else if ($scope.selectedChapterIndex === index) {
                $scope.selectedChapterIndex = null;
            } else {
                $scope.selectedChapterIndex = index;
            }
        }

    });