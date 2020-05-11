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
        .when("/chapterlist", {
            templateUrl: "chapter_list.html",
            controller: "chapterListController"
        })
        .when("/chapter/:chapterName", {
            templateUrl: "show_chapter.html",
            controller: "chapterCtrl"
        })
        .when("/searchpanel", {
            templateUrl: "search_panel.html",
            controller: "searchPanelCtrl"
        })
        .when("/home", {
            template: "<h2>Welcome in Rehash Handbook</h2>"
        });
})
app.service("sampleService", function() {

    this.branchName = ''
    this.subjectName = ''
    this.chapterName = ''
    this.searchString = ''
});




app.controller('bodyCtrl', function($scope, $mdSidenav, $mdDialog, sampleService, $location, $routeParams, sampleService) {
        $location.path('/home');
        $scope.status = ' ashraf ';
        $scope.cardList = ['ashraf', 'firdous'];

        $scope.openLeftMenu = function() {
            $mdSidenav('left').toggle();

        };
        $scope.isSearchPanelVisible = true;

        $scope.openRightMenu = function() {
            $mdSidenav('right').toggle();
        };



        $scope.showPrompt = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            $location.path('/searchpanel');

        };




        $scope.showSearchPanel = function(ev) {


            if ($scope.isSearchPanelVisible == false) {
                $scope.isSearchPanelVisible = true;
            } else {
                $scope.isSearchPanelVisible = false;
            }

            // Appending dialog to document.body to cover sidenav in docs app



        };




    })
    .controller('subjectListController', function($scope, sampleService, $location) {
        $scope.selectedIndex = null;

        $scope.subjectList = [];




        var subjectListRef = firebase.database().ref().child('app').child('subjectlist');



        subjectListRef.on('child_added', function(data) {
            $scope.$apply(function() {
                $scope.subjectList.push(data.child("sname").val());
            });
        });

        $scope.displayChapterList = function(index, item) {


            sampleService.subjectName = item;
            $location.path('/chapterlist');


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

                scope.subjectList.length = 0;

                var subjectListRef1 = firebase.database().ref().child('app').child('subjectlist');
                subjectListRef1.orderByChild("branch").equalTo(newVal).on("child_added", function(snapshot) {
                    console.log(snapshot.child('sname').val());

                    $scope.subjectList.push(snapshot.child("sname").val());

                });


            }
        });
    })
    .controller('branchSelectController', function($scope, sampleService) {

        var branchListRef = firebase.database().ref().child('app').child('branchlist');

        $scope.branchList = [];

        branchListRef.on('child_added', function(data) {
            $scope.$apply(function() {
                $scope.branchList.push(data.val());
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
    .controller("chapterCtrl", function($scope, sampleService, $location, $routeParams, $sce) {

        $scope.chapterListNew = [];
        $scope.sampleService = sampleService;
        $scope.chapterName = sampleService.chapterName;
        $scope.subjectName = sampleService.subjectName;
        $scope.chapterHtml = "<h2>demo</h2>";


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
                    $scope.chapterHtml = $sce.trustAsHtml($div.html());


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


                                    $scope.chapterHtml = $sce.trustAsHtml($div.html());
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

    })
    .controller('searchPanelCtrl', function($scope, sampleService, $location) {




        $scope.searchString = null;

        $scope.searchResultList = [];
        var subjectListRef2 = firebase.database().ref().child('app').child('chapterlist');
        subjectListRef2.on('child_added', function(data) {


            var singleObj = {};
            singleObj['sname'] = data.child("sname").val();
            singleObj['cname'] = data.child("cname").val();
            singleObj['html'] = data.child("html").val();


            $scope.searchResultList.push(singleObj);



        });
        $scope.searchResultListNew = [];



        $scope.$watch('searchString', function(newVal, oldVal, scope) {


            $scope.searchResultListNew.length = 0;
            for (var i = 0; i < $scope.searchResultList.length; i++) {
                if ($scope.searchResultList[i].html.includes(newVal) && newVal != "") {
                    $scope.searchResultListNew.push($scope.searchResultList[i]);


                }
            }












        });

        $scope.displayChapter = function(index, sname, cname) {
            sampleService.subjectName = sname;
            sampleService.chapterName = cname;
            $location.path("/chapter/" + cname);



        }

    });