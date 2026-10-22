var url = "assets/json/",
	allproductlist = "",
	getJSON = function (e, t) {
		var l = new XMLHttpRequest();
		l.open("GET", url + e, !0),
			(l.responseType = "json"),
			(l.onload = function () {
				var e = l.status;
				t(200 === e ? null : e, l.response);
			}),
			l.send();
	};
function loadProductData(e) {
	(document.querySelector("#explorecard-list").innerHTML = ""),
		Array.from(e).forEach(function (e, t) {
			var l = e.like ? "active" : "";
			(document.querySelector("#explorecard-list").innerHTML +=
				'<div class="list-element flex-grow-1 flex-basis:25.000% min-width:220px">            <div class="card explore-box card-animate">                <div class="explore-place-bid-img">                    <input type="hidden" class="form-control" id="' +
				e.id +
				'">                    <div class="d-none">' +
				e.salesType +
				'</div>                    <img src="' +
				e.productImg +
				'" alt="" class="card-img-top explore-img" />                    <div class="bg-overlay"></div>                    <div class="place-bid-btn">                        <a href="#!" class="btn btn-success"><i src="/assets/svg/remix/auction-fill.svg" class="align-bottom me-1"></i> Place Bid</a>                    </div>                </div>                <div class="bookmark-icon position-absolute top-0 end-0 p-2">                    <button type="button" class="btn btn-icon ' +
				l +
				'" aria-pressed="true" toggle.class="active" toggle.aria-pressed="true, false"><i class="mdi mdi-cards-heart fs-16"></i></button>                </div>                <div class="card-body">                    <p class="fw-medium mb-0 float-end"><i class="mdi mdi-heart text-danger align-middle"></i> ' +
				e.totalLikes +
				' </p>                    <h5 class="mb-1"><a href="apps/nft/item-details.html">' +
				e.title +
				'</a></h5>                    <p class="text-muted mb-0">' +
				e.category +
				'</p>                </div>                <div class="card-footer border-top border-top-dashed">                    <div class="d-flex align-items-center">                        <div class="flex-grow-1 fs-14">                            <i src="/assets/svg/remix/price-tag-3-fill.svg" class="text-warning align-bottom me-1"></i> Highest: <span class="fw-medium">' +
				e.highBid +
				'</span>                        </div>                        <h5 class="flex-shrink-0 fs-14 text-primary mb-0">' +
				e.price +
				"ETH</h5>                    </div>                </div>            </div>        </div>"),
				loadMoreBtn();
		});
}
getJSON("nft-explore-product-list.json", function (e, t) {
	null !== e
		? console.log("Something went wrong: " + e)
		: loadProductData((allproductlist = t));
});
var searchProductList = document.getElementById("searchProductList");
searchProductList.addEventListener("keyup", function () {
	var query = searchProductList.value.toLowerCase();
	var products = allproductlist.filter(function (product) {
		return product.title.toLowerCase().includes(query);
	});
	updateProductResults(products);
});

function updateProductResults(products) {
	if (products.length === 0) {
		document.getElementById("noresult").style.display = "block";
		document.getElementById("loadmore").style.display = "none";
	} else {
		document.getElementById("noresult").style.display = "none";
		document.getElementById("loadmore").style.display = "block";
	}
	loadProductData(products);
}

var productCategoryInput = document.getElementById("explore-category-filter");
productCategoryInput.addEventListener("change", function () {
	var category = productCategoryInput.value;
	var products = category
		? allproductlist.filter(function (product) {
			return product.category === category;
		})
		: allproductlist;
	updateProductResults(products);
});

var productFileTypeInput = document.getElementById("explore-file-type-filter");
productFileTypeInput.addEventListener("change", function () {
	var fileType = productFileTypeInput.value;
	var products = fileType
		? allproductlist.filter(function (product) {
			return product.productImg.split(".").pop() === fileType;
		})
		: allproductlist;
	updateProductResults(products);
});

var productSalesInputInput = document.getElementById("explore-sales-type-filter");
productSalesInputInput.addEventListener("change", function () {
	var salesType = productSalesInputInput.value;
	var products = salesType
		? allproductlist.filter(function (product) {
			return product.salesType === salesType;
		})
		: allproductlist;
	updateProductResults(products);
});

var rangeProductPrice = document.getElementById("range-product-price");
noUiSlider.create(rangeProductPrice, {
	start: [0, 1e3],
	step: 10,
	margin: 20,
	connect: !0,
	behaviour: "tap-drag",
	tooltips: [!0, !0],
	range: { min: 0, max: 2e3 },
	format: wNumb({ decimals: 0 })
});
mergeTooltips(rangeProductPrice, 5, " - ");
var minCostInput = document.getElementById("minCost"),
	maxCostInput = document.getElementById("maxCost"),
	filterDataAll = "";
function mergeTooltips(e, c, u) {
	var m = "rtl" === getComputedStyle(e).direction,
		p = "rtl" === e.noUiSlider.options.direction,
		y = "vertical" === e.noUiSlider.options.orientation,
		g = e.noUiSlider.getTooltips(),
		l = e.noUiSlider.getOrigins();
	Array.from(g).forEach(function (e, t) {
		e && l[t].appendChild(e);
	}),
		e &&
			e.noUiSlider.on("update", function (e, t, l, o, n) {
				var a = [[]],
					s = [[]],
					i = [[]],
					r = 0;
				g[0] && ((a[0][0] = 0), (s[0][0] = n[0]), (i[0][0] = e[0]));
				for (var d = 1; d < n.length; d++)
					(!g[d] || n[d] - n[d - 1] > c) &&
						((a[++r] = []), (i[r] = []), (s[r] = [])),
						g[d] &&
							(a[r].push(d), i[r].push(e[d]), s[r].push(n[d]));
				Array.from(a).forEach(function (e, t) {
					for (var l = e.length, o = 0; o < l; o++) {
						var n,
							a,
							r,
							d = e[o];
						o === l - 1
							? ((r = 0),
							  Array.from(s[t]).forEach(function (e) {
									r += 1e3 - e;
							  }),
							  (n = y ? "bottom" : "right"),
							  (a = 1e3 - s[t][p ? 0 : l - 1]),
							  (r = (m && !y ? 100 : 0) + r / l - a),
							  (g[d].innerHTML = i[t].join(u)),
							  (g[d].style.display = "block"),
							  (g[d].style[n] = r + "%"))
							: (g[d].style.display = "none");
					}
				});
			});
}
function _toConsumableArray(e) {
	if (Array.isArray(e)) {
		for (var t = 0, l = Array(e.length); t < e.length; t++) l[t] = e[t];
		return l;
	}
	return Array.from(e);
}
function loadMoreBtn() {
	var o,
		e = document.querySelector("#loadmore");
	e &&
		((o = 10),
		e.addEventListener("click", function (e) {
			var t = [].concat(
				_toConsumableArray(
					document.querySelectorAll("#explorecard-list .list-element")
				)
			);
			if (t) {
				for (var l = o; l < o + 5; l++)
					t[l] && (t[l].style.display = "block");
				(o += 5) >= t.length && (event.target.style.display = "none");
			}
		}));
}
rangeProductPrice.noUiSlider.on("change", function (e, t) {
	var l = allproductlist,
		o =
			(t ? (maxCostInput.value = e[t]) : (minCostInput.value = e[t]),
			maxCostInput.value),
		n = minCostInput.value;
	loadProductData(
		l.filter((e) => parseFloat(e.price) >= n && parseFloat(e.price) <= o)
	);
});
