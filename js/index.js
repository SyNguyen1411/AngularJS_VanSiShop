var app = angular.module("myapp", ["ngRoute"]);
app.controller("myctrl", function ($scope, $rootScope, $http, $routeParams, $window, addProductSV, find) {
    $rootScope.productsOfCart = [];
    $scope.products = [];
    $scope.filterSearchs = {};
    $scope.filterSearchsItem = [];
    $scope.id = $routeParams.id
    $scope.quantity = 1;
    $scope.index = -1;
    $scope.category = '';
    $scope.myFil = false;
    $scope.filterText = [];
    $scope.filterDesign = [];
    $scope.filterSex = [];
    $scope.priceMin = 0;
    $scope.priceMax = 0;
    $scope.totalCart = 0;
    $scope.checkFilterPrice = false;
    $scope.checkSelectProduct = false;
    $scope.checkIndexCart = false;
    $scope.searchText = "";
    $scope.random = 1;
    $scope.numberPage = 1;

    $http.get("data.json").then(function (reponse) {
        $scope.products = reponse.data.products;
        $scope.filterSearchs = reponse.data.filterSeach;

        //set category view product:
        if ($scope.id == "fashions") {
            $scope.category = 'Thời trang';
            $scope.filterSearchsItem = $scope.filterSearchs.fashions;
        } else if ($scope.id == "jewelry") {
            $scope.category = 'Trang sức cao cấp';
            $scope.filterSearchsItem = $scope.filterSearchs.jwelry;
        } else if ($scope.id == "clock") {
            $scope.category = 'Đồng hồ chính hãng thời trang';
            $scope.filterSearchsItem = $scope.filterSearchs.clock;
        }

        $scope.products.forEach(element => {
            if (element.id == $routeParams.id) {
                $scope.index = $scope.products.indexOf(element);
            }
        });


        //Hàm tăng giảm số lượng trong detail:
        $scope.increaseNumber = function () {
            $scope.quantity++
        }

        $scope.reduceNumber = function () {
            if ($scope.quantity > 1) {
                $scope.quantity--
            }
        }

        //Hàm tăng giảm số lượng trong cart: 
        $scope.increaseNumberCart = function (index) {
            $rootScope.productsOfCart[index].quantity++ //Lấy số lượng mà người dùng chọn
            $scope.number = $rootScope.productsOfCart[index].quantity
            $scope.priceProduct = $rootScope.productsOfCart[index].info.priceSale;
            var checkbox = document.getElementById("cart" + index);
            $scope.checkIndexCart = checkbox.checked;

            //Xét nếu đang được chọn thì tăng tổng tiền:
            if ($scope.checkIndexCart === true) {
                $scope.totalCart += $scope.priceProduct;
            }
        }

        $scope.reduceNumberCart = function (index) {
            if ($rootScope.productsOfCart[index].quantity > 1) {
                $rootScope.productsOfCart[index].quantity--
                $scope.number = $rootScope.productsOfCart[index].quantity
                $scope.priceProduct = $rootScope.productsOfCart[index].info.priceSale;
                var checkbox = document.getElementById("cart" + index);
                $scope.checkIndexCart = checkbox.checked;

                //Xét nếu đang được chọn thì giảm tổng tiền:
                if ($scope.checkIndexCart === true) {
                    $scope.totalCart -= $scope.priceProduct;
                }
            }
        }

        //Hàm tính tổng tiền trong giỏ hàng:
        $scope.calcularTotal = function (price, check, index) {
            var checkMirror = !check;
            if (checkMirror === true) {
                $scope.totalCart += price
            } else {
                $scope.totalCart -= price
            }
        }

        // Hàm lấy giá trị filter
        $scope.getFilter = function (index, check, id, filterText) {
            var isCheck = !check;
            var elementLabel = angular.element(document.querySelector('#' + id + index));
            if (isCheck === true) {
                filterText.push(elementLabel.text().trim());
            } else {
                var index1 = filterText.indexOf(elementLabel.text().trim());
                if (index1 != -1) {
                    filterText.splice(index1, 1)
                }
            }
        }

        //Hàm xóa:
        $scope.del = function (index, products12) {
            $window.alert(index);
            $rootScope.productsOfCart = addProductSV("", "", "", index);
        }

    });


    $rootScope.productsOfCart = addProductSV("");
    // Hàm thêm vào giỏ hàng:
    $scope.addProduct = function (product, quantity, size) {
        $rootScope.productsOfCart = addProductSV(product, quantity, size);
        $window.alert("Thêm thành công " + quantity + " sản phẩm vào giỏ hàng");
    }

    // Hàm lấy size thêm vào giỏ hàng:
    $scope.getSizeCart = function (index) {
        $scope.sizeCart = angular.element(document.querySelector("#size" + index)).text().trim();
    }

    //Hàm tìm kiếm:
    $scope.searchText = find("*");
    $scope.searchProduct = function (search) {
        var text1 = angular.copy(search)
        $scope.searchText = find(text1);
        $scope.random = Math.random();
    }

})


// custom directive
app.directive('starGrating', function () {
    return {
        restrict: 'A',
        scope: {
            rating: '=' // Đánh giá được truyền vào từ scope của controller
        },
        template: '<i ng-repeat="star in stars" ng-class="starClass(star)"></i>',
        link: function (scope, element, attrs) {
            scope.stars = [1, 2, 3, 4, 5];

            scope.starClass = function (star) {
                return {
                    "bi": true,
                    "bi-star-fill": star <= scope.rating, // Áp dụng lớp 'bi-star-fill' cho các sao được đánh giá
                    "bi-star": star > scope.rating // Áp dụng lớp 'bi-star-fill' cho các sao không được đánh giá
                }
            }
        }
    };
});

// filter
app.filter('productFavourite', function () {
    return function (input) {
        var products = [];
        console.log(input)
        input.forEach(element => {
            if (element.type == "Yêu thích") {
                products.push(element);
            }
        });
        return products;
    };
});

app.filter('productAccessory', function () {
    return function (input) {
        var products = [];
        input.forEach(element => {
            if (element.type == "Phụ kiện") {
                products.push(element);
            }
        });
        return products;
    };
});
app.filter('productBestSaler', function () {
    return function (input) {
        var products = [];
        input.forEach(element => {
            if (element.type == "Bán chạy nhất") {
                products.push(element);
            }
        });
        return products;
    };
});
app.filter('productFilter', function () {
    return function (input, category, filterText, filterDesign, filterSex, search) {
        var products = [];
        if (category == "fashions") {
            input.forEach(element => {
                if (element.category == "Thời trang") {
                    //Lọc những thuộc tính được check:
                    if (filterText.length != 0) {
                        if (filterText.indexOf(element.categoryItem) != -1) {
                            products.push(element);
                        }
                    }
                    else { products.push(element); }

                    if (filterDesign.length != 0) {
                        products = products.filter(function (element) {
                            return filterDesign.indexOf(element.design) != -1
                        })
                    }

                    if (filterSex.length != 0) {
                        products = products.filter(function (element) {
                            var check = false;
                            var arrSex = element.sex
                            arrSex.forEach(item => {
                                if (filterSex.indexOf(item) != -1) {
                                    check = true;
                                }
                            });
                            return check;
                        }
                        )
                    }
                }
            });
        } else if (category == "jewelry") {
            input.forEach(element => {
                if (element.category == "Trang sức") {
                    //Lọc những thuộc tính được check:
                    if (filterText.length != 0) {
                        if (filterText.indexOf(element.categoryItem) != -1) {
                            products.push(element);
                        }
                    }
                    else { products.push(element); }

                    if (filterDesign.length != 0) {
                        products = products.filter(function (element) {
                            return filterDesign.indexOf(element.design) != -1
                        })
                    }

                    if (filterSex.length != 0) {
                        products = products.filter(function (element) {
                            var check = false;
                            var arrSex = element.sex
                            arrSex.forEach(item => {
                                if (filterSex.indexOf(item) != -1) {
                                    check = true;
                                }
                            });
                            return check;
                        }
                        )
                    }
                }
            });
        } else if (category == "clock") {
            input.forEach(element => {
                if (element.category == "Đồng hồ") {
                    //Lọc những thuộc tính được check:
                    if (filterText.length != 0) {
                        if (filterText.indexOf(element.categoryItem) != -1) {
                            products.push(element);
                        }
                    }
                    else { products.push(element); }

                    if (filterDesign.length != 0) {
                        products = products.filter(function (element) {
                            return filterDesign.indexOf(element.design) != -1
                        })
                    }

                    if (filterSex.length != 0) {
                        products = products.filter(function (element) {
                            var check = false;
                            var arrSex = element.sex
                            arrSex.forEach(item => {
                                if (filterSex.indexOf(item) != -1) {
                                    check = true;
                                }
                            });
                            return check;
                        }
                        )
                    }
                }
            });
        } else {
            if (search != "" && search.length != 0) {
                input.forEach(element => {
                    if ((element.name.indexOf(search) != -1) || (element.category.indexOf(search) != -1) || (element.categoryItem.indexOf(search) != -1)) {
                        products.push(element)
                    }
                })
            } else {   
                input.forEach(element => {
                    products.push(element)
                })
            }
        }
        return products;
    };
});

// Service lưu trữ dữ liệu:
app.factory('addProductSV', function ($window) {
    var productOfCart = [];
    return function (product, quantity, size , index) {
        var productCopy = angular.copy(product);
        if (angular.isObject(productCopy)) {
            var productAdd = {
                "info": productCopy,
                "quantity": quantity,
                "size": size
            }
            productOfCart.push(productAdd);
        }

        if(index > -1) {
            productOfCart.splice(index, 1);
        }

        return productOfCart;
    }
})

app.factory('find', function ($window) {
    var findText = "";
    return function (searchText) {
        var text = angular.copy(searchText);
        if (text != "*") {
            findText = text;
        }
        return findText;
    }
})

// Route
app.config(function ($routeProvider) {
    $routeProvider
        .when("/home", {
            templateUrl: "home.html?" + Math.random(),
            controller: "myctrl"
        })
        .when("/login", {
            templateUrl: "login.html?" + Math.random(),
            controller: "myctrl"
        })
        .when("/reg", {
            templateUrl: "dangky.html?" + Math.random(),
            controller: "myctrl"
        })
        .when("/products/:id", {
            templateUrl: "sanpham.html?" + Math.random(),
            controller: "myctrl"
        })
        .when("/detail/:id", {
            templateUrl: "detail.html?" + Math.random(),
            controller: "myctrl"
        })
        .when("/cart/:id", {
            templateUrl: "cart.html?" + Math.random(),
            controller: "myctrl"
        })
        .otherwise({
            redirectTo: "/home"
        })
});


