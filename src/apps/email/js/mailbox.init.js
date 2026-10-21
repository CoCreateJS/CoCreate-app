var url = "assets/json/",
	allmaillist = "";
// const loader = document.querySelector("#elmLoader");
var getJSON = function (e, t) {
	var a = new XMLHttpRequest();
	a.open("GET", url + e, !0),
		(a.responseType = "json"),
		(a.onload = function () {
			var e = a.status;
			200 === e
				? ((document.getElementById("elmLoader").innerHTML = ""),
				  t(null, a.response))
				: t(e, a.response);
		}),
		a.send();
};
function checkBoxAll() {
	Array.from(
		document.querySelectorAll(".checkbox-wrapper-mail input")
	).forEach(function (e) {
		e.addEventListener("click", function (e) {
			1 == e.target.checked
				? e.target.closest("li").classList.add("active")
				: e.target.closest("li").classList.remove("active");
		});
	});
	var e = document.querySelectorAll(
		".tab-pane.show .checkbox-wrapper-mail input"
	);
	function a() {
		var e = document.querySelectorAll(
				".tab-pane.show .checkbox-wrapper-mail input"
			),
			t = document.querySelectorAll(
				".tab-pane.show .checkbox-wrapper-mail input:checked"
			).length;
		Array.from(e).forEach(function (e) {
			(e.checked = !0),
				e.parentNode.parentNode.parentNode.classList.add("active");
		}),
			(document.getElementById("email-topbar-actions").style.display =
				0 < t ? "none" : "block"),
			0 < t
				? Array.from(e).forEach(function (e) {
						(e.checked = !1),
							e.parentNode.parentNode.parentNode.classList.remove(
								"active"
							);
				  })
				: Array.from(e).forEach(function (e) {
						(e.checked = !0),
							e.parentNode.parentNode.parentNode.classList.add(
								"active"
							);
				  }),
			(this.onclick = l);
	}
	function l() {
		var e = document.querySelectorAll(
				".tab-pane.show .checkbox-wrapper-mail input"
			),
			t = document.querySelectorAll(
				".tab-pane.show .checkbox-wrapper-mail input:checked"
			).length;
		Array.from(e).forEach(function (e) {
			(e.checked = !1),
				e.parentNode.parentNode.parentNode.classList.remove("active");
		}),
			(document.getElementById("email-topbar-actions").style.display =
				0 < t ? "none" : "block"),
			0 < t
				? Array.from(e).forEach(function (e) {
						(e.checked = !1),
							e.parentNode.parentNode.parentNode.classList.remove(
								"active"
							);
				  })
				: Array.from(e).forEach(function (e) {
						(e.checked = !0),
							e.parentNode.parentNode.parentNode.classList.add(
								"active"
							);
				  }),
			(this.onclick = a);
	}
	Array.from(e).forEach(function (e) {
		e.addEventListener("click", function (e) {
			var t = document.querySelectorAll(
					".tab-pane.show .checkbox-wrapper-mail input"
				),
				a = document.getElementById("checkall"),
				l = document.querySelectorAll(
					".tab-pane.show .checkbox-wrapper-mail input:checked"
				).length;
			(a.checked = 0 < l),
				(a.indeterminate = 0 < l && l < t.length),
				e.target.closest("li").classList.contains("active"),
				(document.getElementById("email-topbar-actions").style.display =
					0 < l ? "block" : "none");
		});
	}),
		(document.getElementById("checkall").onclick = a);
}
getJSON("mail-list.init.json", function (e, t) {
	null !== e
		? console.log("Something went wrong: " + e)
		: ((allmaillist = t[0].primary),
		  (socialmaillist = t[0].social),
		  (promotionsmaillist = t[0].promotions));
});

var currentChatId = "users-chat";
function scrollToBottom(e) {
	setTimeout(() => {
		const chatConversation = document.getElementById("chat-conversation");
		const chatViewport = chatConversation && chatConversation.firstElementChild;
		if (!chatViewport) return;
		chatViewport.scrollTop =
			document.getElementById("users-conversation").scrollHeight;
	}, 100);
}
scrollToBottom(currentChatId);

function emailDetailChange() {
	Array.from(document.querySelectorAll(".message-list li")).forEach(function (
		c
	) {
		c.addEventListener("click", function () {
			var e = c.querySelector(
					".checkbox-wrapper-mail .form-check-input"
				).value,
				e =
					(document
						.querySelector(".remove-mail")
						.setAttribute("data-remove-id", e),
					c.querySelector(".subject-title").innerHTML),
				a =
					((document.querySelector(".email-subject-title").innerHTML =
						e),
					c.querySelector(".title-name").innerHTML),
				t =
					(Array.from(
						document.querySelectorAll(".accordion-item.left")
					).forEach(function (e) {
						e.querySelector(".email-user-name").innerHTML = a;
						var t = c.querySelector(".mail-userimg").value;
						e.querySelector("img").setAttribute("src", t);
					}),
					document.querySelector(".user-name-text").innerHTML),
				l = document
					.querySelector(".header-profile-user")
					.getAttribute("src");
			Array.from(
				document.querySelectorAll(".accordion-item.right")
			).forEach(function (e) {
				(e.querySelector(".email-user-name-right").innerHTML = t),
					e.querySelector("img").setAttribute("src", l);
			});
		});
	});
}

const triggerTabList = document.querySelectorAll(
	"#mail-filter-navlist .nav-tabs button"
);
// function resizeEvent() {
// 	var e;
// 	document.documentElement.clientWidth < 767 &&
// 		((e = document.querySelector(".email-chat-list a.active")) &&
// 			e.classList.remove("active"),
// 		(document.getElementById("emailchat-detailElem").style.display =
// 			"none"));
// }
// triggerTabList.forEach((e) => {
// 	const t = new bootstrap.Tab(e);
// 	e.addEventListener("click", (e) => {
// 		e.preventDefault();
// 		document.querySelector(".tab-content .tab-pane.show");
// 		t.show();
// 	});
// }),
// 	resizeEvent(),
// 	(window.onresize = resizeEvent);
