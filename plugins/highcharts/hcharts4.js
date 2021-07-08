/*
 Highcharts JS v9.1.2 (2021-06-16)

 Accessibility module

 (c) 2010-2021 Highsoft AS
 Author: Oystein Moseng

 License: www.highcharts.com/license
*/
"use strict";
(function (b) {
  "object" === typeof module && module.exports
    ? ((b["default"] = b), (module.exports = b))
    : "function" === typeof define && define.amd
    ? define("highcharts/modules/accessibility", ["highcharts"], function (v) {
        b(v);
        b.Highcharts = v;
        return b;
      })
    : b("undefined" !== typeof Highcharts ? Highcharts : void 0);
})(function (b) {
  function v(b, e, r, p) {
    b.hasOwnProperty(e) || (b[e] = p.apply(null, r));
  }
  b = b ? b._modules : {};
  v(
    b,
    "Accessibility/Utils/HTMLUtilities.js",
    [b["Core/Globals.js"], b["Core/Utilities.js"]],
    function (b, e) {
      var w = b.doc,
        p = b.win,
        u = e.merge;
      return {
        addClass: function (b, l) {
          b.classList
            ? b.classList.add(l)
            : 0 > b.className.indexOf(l) && (b.className += l);
        },
        escapeStringForHTML: function (b) {
          return b
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#x27;")
            .replace(/\//g, "&#x2F;");
        },
        getElement: function (b) {
          return w.getElementById(b);
        },
        getFakeMouseEvent: function (b) {
          if ("function" === typeof p.MouseEvent) return new p.MouseEvent(b);
          if (w.createEvent) {
            var t = w.createEvent("MouseEvent");
            if (t.initMouseEvent)
              return (
                t.initMouseEvent(
                  b,
                  !0,
                  !0,
                  p,
                  "click" === b ? 1 : 0,
                  0,
                  0,
                  0,
                  0,
                  !1,
                  !1,
                  !1,
                  !1,
                  0,
                  null
                ),
                t
              );
          }
          return { type: b };
        },
        getHeadingTagNameForElement: function (b) {
          var t = function (b) {
              b = parseInt(b.slice(1), 10);
              return "h" + Math.min(6, b + 1);
            },
            m = function (b) {
              var h;
              a: {
                for (h = b; (h = h.previousSibling); ) {
                  var g = h.tagName || "";
                  if (/H[1-6]/.test(g)) {
                    h = g;
                    break a;
                  }
                }
                h = "";
              }
              if (h) return t(h);
              b = b.parentElement;
              if (!b) return "p";
              h = b.tagName;
              return /H[1-6]/.test(h) ? t(h) : m(b);
            };
          return m(b);
        },
        removeElement: function (b) {
          b && b.parentNode && b.parentNode.removeChild(b);
        },
        reverseChildNodes: function (b) {
          for (var t = b.childNodes.length; t--; )
            b.appendChild(b.childNodes[t]);
        },
        setElAttrs: function (b, e) {
          Object.keys(e).forEach(function (m) {
            var h = e[m];
            null === h ? b.removeAttribute(m) : b.setAttribute(m, h);
          });
        },
        stripHTMLTagsFromString: function (b) {
          return "string" === typeof b ? b.replace(/<\/?[^>]+(>|$)/g, "") : b;
        },
        visuallyHideElement: function (b) {
          u(!0, b.style, {
            position: "absolute",
            width: "1px",
            height: "1px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            clip: "rect(1px, 1px, 1px, 1px)",
            marginTop: "-3px",
            "-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=1)",
            filter: "alpha(opacity=1)",
            opacity: "0.01",
          });
        },
      };
    }
  );
  v(
    b,
    "Accessibility/Utils/ChartUtilities.js",
    [b["Accessibility/Utils/HTMLUtilities.js"], b["Core/Utilities.js"]],
    function (b, e) {
      function w(a) {
        var c = a.chart,
          d = {},
          f = "Seconds";
        d.Seconds = ((a.max || 0) - (a.min || 0)) / 1e3;
        d.Minutes = d.Seconds / 60;
        d.Hours = d.Minutes / 60;
        d.Days = d.Hours / 24;
        ["Minutes", "Hours", "Days"].forEach(function (a) {
          2 < d[a] && (f = a);
        });
        var n = d[f].toFixed("Seconds" !== f && "Minutes" !== f ? 1 : 0);
        return c.langFormat("accessibility.axis.timeRange" + f, {
          chart: c,
          axis: a,
          range: n.replace(".0", ""),
        });
      }
      function p(a) {
        var c = a.chart,
          d =
            (c.options &&
              c.options.accessibility &&
              c.options.accessibility.screenReaderSection
                .axisRangeDateFormat) ||
            "",
          f = function (f) {
            return a.dateTime ? c.time.dateFormat(d, a[f]) : a[f];
          };
        return c.langFormat("accessibility.axis.rangeFromTo", {
          chart: c,
          axis: a,
          rangeFrom: f("min"),
          rangeTo: f("max"),
        });
      }
      function u(a) {
        if (a.points && a.points.length)
          return (
            (a = q(a.points, function (a) {
              return !!a.graphic;
            })) &&
            a.graphic &&
            a.graphic.element
          );
      }
      function t(a) {
        var c = u(a);
        return (
          (c && c.parentNode) ||
          (a.graph && a.graph.element) ||
          (a.group && a.group.element)
        );
      }
      function l(a, c) {
        c.setAttribute("aria-hidden", !1);
        c !== a.renderTo &&
          c.parentNode &&
          (Array.prototype.forEach.call(c.parentNode.childNodes, function (a) {
            a.hasAttribute("aria-hidden") || a.setAttribute("aria-hidden", !0);
          }),
          l(a, c.parentNode));
      }
      var m = b.stripHTMLTagsFromString,
        h = e.defined,
        q = e.find,
        g = e.fireEvent;
      return {
        getChartTitle: function (a) {
          return m(
            a.options.title.text ||
              a.langFormat("accessibility.defaultChartTitle", { chart: a })
          );
        },
        getAxisDescription: function (a) {
          return (
            a &&
            ((a.userOptions &&
              a.userOptions.accessibility &&
              a.userOptions.accessibility.description) ||
              (a.axisTitle && a.axisTitle.textStr) ||
              a.options.id ||
              (a.categories && "categories") ||
              (a.dateTime && "Time") ||
              "values")
          );
        },
        getAxisRangeDescription: function (a) {
          var c = a.options || {};
          return c.accessibility &&
            "undefined" !== typeof c.accessibility.rangeDescription
            ? c.accessibility.rangeDescription
            : a.categories
            ? ((c = a.chart),
              (a =
                a.dataMax && a.dataMin
                  ? c.langFormat("accessibility.axis.rangeCategories", {
                      chart: c,
                      axis: a,
                      numCategories: a.dataMax - a.dataMin + 1,
                    })
                  : ""),
              a)
            : !a.dateTime || (0 !== a.min && 0 !== a.dataMin)
            ? p(a)
            : w(a);
        },
        getPointFromXY: function (a, c, d) {
          for (var f = a.length, n; f--; )
            if (
              (n = q(a[f].points || [], function (a) {
                return a.x === c && a.y === d;
              }))
            )
              return n;
        },
        getSeriesFirstPointElement: u,
        getSeriesFromName: function (a, c) {
          return c
            ? (a.series || []).filter(function (a) {
                return a.name === c;
              })
            : a.series;
        },
        getSeriesA11yElement: t,
        unhideChartElementFromAT: l,
        hideSeriesFromAT: function (a) {
          (a = t(a)) && a.setAttribute("aria-hidden", !0);
        },
        scrollToPoint: function (a) {
          var c = a.series.xAxis,
            d = a.series.yAxis,
            f = c && c.scrollbar ? c : d;
          if ((c = f && f.scrollbar) && h(c.to) && h(c.from)) {
            d = c.to - c.from;
            if (h(f.dataMin) && h(f.dataMax)) {
              var n = f.toPixels(f.dataMin),
                b = f.toPixels(f.dataMax);
              a =
                (f.toPixels(a["xAxis" === f.coll ? "x" : "y"] || 0) - n) /
                (b - n);
            } else a = 0;
            c.updatePosition(a - d / 2, a + d / 2);
            g(c, "changed", {
              from: c.from,
              to: c.to,
              trigger: "scrollbar",
              DOMEvent: null,
            });
          }
        },
      };
    }
  );
  v(
    b,
    "Accessibility/KeyboardNavigationHandler.js",
    [b["Core/Utilities.js"]],
    function (b) {
      function e(b, e) {
        this.chart = b;
        this.keyCodeMap = e.keyCodeMap || [];
        this.validate = e.validate;
        this.init = e.init;
        this.terminate = e.terminate;
        this.response = { success: 1, prev: 2, next: 3, noHandler: 4, fail: 5 };
      }
      var w = b.find;
      e.prototype = {
        run: function (b) {
          var e = b.which || b.keyCode,
            t = this.response.noHandler,
            l = w(this.keyCodeMap, function (b) {
              return -1 < b[0].indexOf(e);
            });
          l
            ? (t = l[1].call(this, e, b))
            : 9 === e && (t = this.response[b.shiftKey ? "prev" : "next"]);
          return t;
        },
      };
      return e;
    }
  );
  v(
    b,
    "Accessibility/Utils/DOMElementProvider.js",
    [
      b["Core/Globals.js"],
      b["Accessibility/Utils/HTMLUtilities.js"],
      b["Core/Utilities.js"],
    ],
    function (b, e, r) {
      var w = b.doc,
        u = e.removeElement;
      b = r.extend;
      e = function () {
        this.elements = [];
      };
      b(e.prototype, {
        createElement: function () {
          var b = w.createElement.apply(w, arguments);
          this.elements.push(b);
          return b;
        },
        destroyCreatedElements: function () {
          this.elements.forEach(function (b) {
            u(b);
          });
          this.elements = [];
        },
      });
      return e;
    }
  );
  v(
    b,
    "Accessibility/Utils/EventProvider.js",
    [b["Core/Globals.js"], b["Core/Utilities.js"]],
    function (b, e) {
      var w = e.addEvent;
      e = e.extend;
      var p = function () {
        this.eventRemovers = [];
      };
      e(p.prototype, {
        addEvent: function () {
          var e = w.apply(b, arguments);
          this.eventRemovers.push(e);
          return e;
        },
        removeAddedEvents: function () {
          this.eventRemovers.forEach(function (b) {
            b();
          });
          this.eventRemovers = [];
        },
      });
      return p;
    }
  );
  v(
    b,
    "Accessibility/AccessibilityComponent.js",
    [
      b["Accessibility/Utils/ChartUtilities.js"],
      b["Accessibility/Utils/DOMElementProvider.js"],
      b["Accessibility/Utils/EventProvider.js"],
      b["Core/Globals.js"],
      b["Accessibility/Utils/HTMLUtilities.js"],
      b["Core/Utilities.js"],
    ],
    function (b, e, r, p, u, t) {
      function l() {}
      var m = b.unhideChartElementFromAT,
        h = p.doc,
        q = p.win,
        g = u.removeElement,
        a = u.getFakeMouseEvent;
      b = t.extend;
      var c = t.fireEvent,
        d = t.merge;
      l.prototype = {
        initBase: function (a) {
          this.chart = a;
          this.eventProvider = new r();
          this.domElementProvider = new e();
          this.keyCodes = {
            left: 37,
            right: 39,
            up: 38,
            down: 40,
            enter: 13,
            space: 32,
            esc: 27,
            tab: 9,
          };
        },
        addEvent: function () {
          return this.eventProvider.addEvent.apply(
            this.eventProvider,
            arguments
          );
        },
        createElement: function () {
          return this.domElementProvider.createElement.apply(
            this.domElementProvider,
            arguments
          );
        },
        fireEventOnWrappedOrUnwrappedElement: function (a, n) {
          var f = n.type;
          h.createEvent && (a.dispatchEvent || a.fireEvent)
            ? a.dispatchEvent
              ? a.dispatchEvent(n)
              : a.fireEvent(f, n)
            : c(a, f, n);
        },
        fakeClickEvent: function (c) {
          if (c) {
            var f = a("click");
            this.fireEventOnWrappedOrUnwrappedElement(c, f);
          }
        },
        addProxyGroup: function (a) {
          this.createOrUpdateProxyContainer();
          var c = this.createElement("div");
          Object.keys(a || {}).forEach(function (f) {
            null !== a[f] && c.setAttribute(f, a[f]);
          });
          this.chart.a11yProxyContainer.appendChild(c);
          return c;
        },
        createOrUpdateProxyContainer: function () {
          var a = this.chart,
            c = a.renderer.box;
          a.a11yProxyContainer =
            a.a11yProxyContainer || this.createProxyContainerElement();
          c.nextSibling !== a.a11yProxyContainer &&
            a.container.insertBefore(a.a11yProxyContainer, c.nextSibling);
        },
        createProxyContainerElement: function () {
          var a = h.createElement("div");
          a.className = "highcharts-a11y-proxy-container";
          return a;
        },
        createProxyButton: function (a, c, b, g, h) {
          var f = a.element,
            n = this.createElement("button"),
            E = d({ "aria-label": f.getAttribute("aria-label") }, b);
          Object.keys(E).forEach(function (a) {
            null !== E[a] && n.setAttribute(a, E[a]);
          });
          n.className = "highcharts-a11y-proxy-button";
          a.hasClass("highcharts-no-tooltip") &&
            (n.className += " highcharts-no-tooltip");
          h && this.addEvent(n, "click", h);
          this.setProxyButtonStyle(n);
          this.updateProxyButtonPosition(n, g || a);
          this.proxyMouseEventsForButton(f, n);
          c.appendChild(n);
          E["aria-hidden"] || m(this.chart, n);
          return n;
        },
        getElementPosition: function (a) {
          var c = a.element;
          return (a = this.chart.renderTo) && c && c.getBoundingClientRect
            ? ((c = c.getBoundingClientRect()),
              (a = a.getBoundingClientRect()),
              {
                x: c.left - a.left,
                y: c.top - a.top,
                width: c.right - c.left,
                height: c.bottom - c.top,
              })
            : { x: 0, y: 0, width: 1, height: 1 };
        },
        setProxyButtonStyle: function (a) {
          d(!0, a.style, {
            borderWidth: "0",
            backgroundColor: "transparent",
            cursor: "pointer",
            outline: "none",
            opacity: "0.001",
            filter: "alpha(opacity=1)",
            zIndex: "999",
            overflow: "hidden",
            padding: "0",
            margin: "0",
            display: "block",
            position: "absolute",
          });
          a.style["-ms-filter"] =
            "progid:DXImageTransform.Microsoft.Alpha(Opacity=1)";
        },
        updateProxyButtonPosition: function (a, c) {
          c = this.getElementPosition(c);
          d(!0, a.style, {
            width: (c.width || 1) + "px",
            height: (c.height || 1) + "px",
            left: (Math.round(c.x) || 0) + "px",
            top: (Math.round(c.y) || 0) + "px",
          });
        },
        proxyMouseEventsForButton: function (a, c) {
          var b = this;
          "click touchstart touchend touchcancel touchmove mouseover mouseenter mouseleave mouseout"
            .split(" ")
            .forEach(function (n) {
              var f = 0 === n.indexOf("touch");
              b.addEvent(
                c,
                n,
                function (c) {
                  var d = f ? b.cloneTouchEvent(c) : b.cloneMouseEvent(c);
                  a && b.fireEventOnWrappedOrUnwrappedElement(a, d);
                  c.stopPropagation();
                  "touchstart" !== n &&
                    "touchmove" !== n &&
                    "touchend" !== n &&
                    c.preventDefault();
                },
                { passive: !1 }
              );
            });
        },
        cloneMouseEvent: function (c) {
          if ("function" === typeof q.MouseEvent)
            return new q.MouseEvent(c.type, c);
          if (h.createEvent) {
            var b = h.createEvent("MouseEvent");
            if (b.initMouseEvent)
              return (
                b.initMouseEvent(
                  c.type,
                  c.bubbles,
                  c.cancelable,
                  c.view || q,
                  c.detail,
                  c.screenX,
                  c.screenY,
                  c.clientX,
                  c.clientY,
                  c.ctrlKey,
                  c.altKey,
                  c.shiftKey,
                  c.metaKey,
                  c.button,
                  c.relatedTarget
                ),
                b
              );
          }
          return a(c.type);
        },
        cloneTouchEvent: function (a) {
          var c = function (a) {
            for (var c = [], b = 0; b < a.length; ++b) {
              var d = a.item(b);
              d && c.push(d);
            }
            return c;
          };
          if ("function" === typeof q.TouchEvent)
            return (
              (c = new q.TouchEvent(a.type, {
                touches: c(a.touches),
                targetTouches: c(a.targetTouches),
                changedTouches: c(a.changedTouches),
                ctrlKey: a.ctrlKey,
                shiftKey: a.shiftKey,
                altKey: a.altKey,
                metaKey: a.metaKey,
                bubbles: a.bubbles,
                cancelable: a.cancelable,
                composed: a.composed,
                detail: a.detail,
                view: a.view,
              })),
              a.defaultPrevented && c.preventDefault(),
              c
            );
          c = this.cloneMouseEvent(a);
          c.touches = a.touches;
          c.changedTouches = a.changedTouches;
          c.targetTouches = a.targetTouches;
          return c;
        },
        destroyBase: function () {
          g(this.chart.a11yProxyContainer);
          this.domElementProvider.destroyCreatedElements();
          this.eventProvider.removeAddedEvents();
        },
      };
      b(l.prototype, {
        init: function () {},
        getKeyboardNavigation: function () {},
        onChartUpdate: function () {},
        onChartRender: function () {},
        destroy: function () {},
      });
      return l;
    }
  );
  v(
    b,
    "Accessibility/KeyboardNavigation.js",
    [
      b["Core/Chart/Chart.js"],
      b["Core/Globals.js"],
      b["Core/Utilities.js"],
      b["Accessibility/Utils/HTMLUtilities.js"],
      b["Accessibility/Utils/EventProvider.js"],
    ],
    function (b, e, r, p, u) {
      function t(a, c) {
        this.init(a, c);
      }
      var l = e.doc,
        m = e.win,
        h = r.addEvent,
        q = r.fireEvent,
        g = p.getElement;
      h(l, "keydown", function (a) {
        27 === (a.which || a.keyCode) &&
          e.charts &&
          e.charts.forEach(function (a) {
            a && a.dismissPopupContent && a.dismissPopupContent();
          });
      });
      b.prototype.dismissPopupContent = function () {
        var a = this;
        q(this, "dismissPopupContent", {}, function () {
          a.tooltip && a.tooltip.hide(0);
          a.hideExportMenu();
        });
      };
      t.prototype = {
        init: function (a, c) {
          var b = this,
            g = (this.eventProvider = new u());
          this.chart = a;
          this.components = c;
          this.modules = [];
          this.currentModuleIx = 0;
          this.update();
          g.addEvent(this.tabindexContainer, "keydown", function (a) {
            return b.onKeydown(a);
          });
          g.addEvent(this.tabindexContainer, "focus", function (a) {
            return b.onFocus(a);
          });
          ["mouseup", "touchend"].forEach(function (a) {
            return g.addEvent(l, a, function () {
              return b.onMouseUp();
            });
          });
          ["mousedown", "touchstart"].forEach(function (c) {
            return g.addEvent(a.renderTo, c, function () {
              b.isClickingChart = !0;
            });
          });
          g.addEvent(a.renderTo, "mouseover", function () {
            b.pointerIsOverChart = !0;
          });
          g.addEvent(a.renderTo, "mouseout", function () {
            b.pointerIsOverChart = !1;
          });
          this.modules.length && this.modules[0].init(1);
        },
        update: function (a) {
          var c = this.chart.options.accessibility;
          c = c && c.keyboardNavigation;
          var b = this.components;
          this.updateContainerTabindex();
          c && c.enabled && a && a.length
            ? ((this.modules = a.reduce(function (a, c) {
                c = b[c].getKeyboardNavigation();
                return a.concat(c);
              }, [])),
              this.updateExitAnchor())
            : ((this.modules = []),
              (this.currentModuleIx = 0),
              this.removeExitAnchor());
        },
        onFocus: function (a) {
          var c = this.chart;
          a = a.relatedTarget && c.container.contains(a.relatedTarget);
          this.exiting ||
            this.tabbingInBackwards ||
            this.isClickingChart ||
            a ||
            !this.modules[0] ||
            this.modules[0].init(1);
          this.exiting = !1;
        },
        onMouseUp: function () {
          delete this.isClickingChart;
          if (!this.keyboardReset && !this.pointerIsOverChart) {
            var a = this.chart,
              c = this.modules && this.modules[this.currentModuleIx || 0];
            c && c.terminate && c.terminate();
            a.focusElement && a.focusElement.removeFocusBorder();
            this.currentModuleIx = 0;
            this.keyboardReset = !0;
          }
        },
        onKeydown: function (a) {
          a = a || m.event;
          var c,
            b =
              this.modules &&
              this.modules.length &&
              this.modules[this.currentModuleIx];
          this.exiting = this.keyboardReset = !1;
          if (b) {
            var g = b.run(a);
            g === b.response.success
              ? (c = !0)
              : g === b.response.prev
              ? (c = this.prev())
              : g === b.response.next && (c = this.next());
            c && (a.preventDefault(), a.stopPropagation());
          }
        },
        prev: function () {
          return this.move(-1);
        },
        next: function () {
          return this.move(1);
        },
        move: function (a) {
          var c = this.modules && this.modules[this.currentModuleIx];
          c && c.terminate && c.terminate(a);
          this.chart.focusElement &&
            this.chart.focusElement.removeFocusBorder();
          this.currentModuleIx += a;
          if ((c = this.modules && this.modules[this.currentModuleIx])) {
            if (c.validate && !c.validate()) return this.move(a);
            if (c.init) return c.init(a), !0;
          }
          this.currentModuleIx = 0;
          this.exiting = !0;
          0 < a ? this.exitAnchor.focus() : this.tabindexContainer.focus();
          return !1;
        },
        updateExitAnchor: function () {
          var a = g("highcharts-end-of-chart-marker-" + this.chart.index);
          this.removeExitAnchor();
          a
            ? (this.makeElementAnExitAnchor(a), (this.exitAnchor = a))
            : this.createExitAnchor();
        },
        updateContainerTabindex: function () {
          var a = this.chart.options.accessibility;
          a = a && a.keyboardNavigation;
          a = !(a && !1 === a.enabled);
          var c = this.chart,
            b = c.container;
          c.renderTo.hasAttribute("tabindex") &&
            (b.removeAttribute("tabindex"), (b = c.renderTo));
          this.tabindexContainer = b;
          var g = b.getAttribute("tabindex");
          a && !g
            ? b.setAttribute("tabindex", "0")
            : a || c.container.removeAttribute("tabindex");
        },
        makeElementAnExitAnchor: function (a) {
          var c = this.tabindexContainer.getAttribute("tabindex") || 0;
          a.setAttribute("class", "highcharts-exit-anchor");
          a.setAttribute("tabindex", c);
          a.setAttribute("aria-hidden", !1);
          this.addExitAnchorEventsToEl(a);
        },
        createExitAnchor: function () {
          var a = this.chart,
            c = (this.exitAnchor = l.createElement("div"));
          a.renderTo.appendChild(c);
          this.makeElementAnExitAnchor(c);
        },
        removeExitAnchor: function () {
          this.exitAnchor &&
            this.exitAnchor.parentNode &&
            (this.exitAnchor.parentNode.removeChild(this.exitAnchor),
            delete this.exitAnchor);
        },
        addExitAnchorEventsToEl: function (a) {
          var c = this.chart,
            b = this;
          this.eventProvider.addEvent(a, "focus", function (a) {
            a = a || m.event;
            (a.relatedTarget && c.container.contains(a.relatedTarget)) ||
            b.exiting
              ? (b.exiting = !1)
              : ((b.tabbingInBackwards = !0),
                b.tabindexContainer.focus(),
                delete b.tabbingInBackwards,
                a.preventDefault(),
                b.modules &&
                  b.modules.length &&
                  ((b.currentModuleIx = b.modules.length - 1),
                  (a = b.modules[b.currentModuleIx]) &&
                  a.validate &&
                  !a.validate()
                    ? b.prev()
                    : a && a.init(-1)));
          });
        },
        destroy: function () {
          this.removeExitAnchor();
          this.eventProvider.removeAddedEvents();
          this.chart.container.removeAttribute("tabindex");
        },
      };
      return t;
    }
  );
  v(
    b,
    "Accessibility/Components/LegendComponent.js",
    [
      b["Core/Chart/Chart.js"],
      b["Core/Globals.js"],
      b["Core/Legend.js"],
      b["Core/Utilities.js"],
      b["Accessibility/AccessibilityComponent.js"],
      b["Accessibility/KeyboardNavigationHandler.js"],
      b["Accessibility/Utils/HTMLUtilities.js"],
    ],
    function (b, e, r, p, u, t, l) {
      function m(a) {
        var c = a.legend && a.legend.allItems,
          b = a.options.legend.accessibility || {};
        return !(
          !c ||
          !c.length ||
          (a.colorAxis && a.colorAxis.length) ||
          !1 === b.enabled
        );
      }
      var h = p.addEvent,
        q = p.extend,
        g = p.find,
        a = p.fireEvent,
        c = p.isNumber,
        d = l.removeElement,
        f = l.stripHTMLTagsFromString;
      b.prototype.highlightLegendItem = function (b) {
        var g = this.legend.allItems,
          d =
            this.accessibility &&
            this.accessibility.components.legend.highlightedLegendItemIx;
        if (g[b]) {
          c(d) && g[d] && a(g[d].legendGroup.element, "mouseout");
          d = this.legend;
          var n = d.allItems[b].pageIx,
            f = d.currentPage;
          "undefined" !== typeof n && n + 1 !== f && d.scroll(1 + n - f);
          this.setFocusToElement(g[b].legendItem, g[b].a11yProxyElement);
          a(g[b].legendGroup.element, "mouseover");
          return !0;
        }
        return !1;
      };
      h(r, "afterColorizeItem", function (a) {
        var c = a.item;
        this.chart.options.accessibility.enabled &&
          c &&
          c.a11yProxyElement &&
          c.a11yProxyElement.setAttribute(
            "aria-pressed",
            a.visible ? "true" : "false"
          );
      });
      b = function () {};
      b.prototype = new u();
      q(b.prototype, {
        init: function () {
          var a = this;
          this.proxyElementsList = [];
          this.recreateProxies();
          this.addEvent(r, "afterScroll", function () {
            this.chart === a.chart &&
              (a.updateProxiesPositions(),
              a.updateLegendItemProxyVisibility(),
              this.chart.highlightLegendItem(a.highlightedLegendItemIx));
          });
          this.addEvent(r, "afterPositionItem", function (c) {
            this.chart === a.chart &&
              this.chart.renderer &&
              a.updateProxyPositionForItem(c.item);
          });
        },
        updateLegendItemProxyVisibility: function () {
          var a = this.chart.legend,
            c = a.currentPage || 1,
            b = a.clipHeight || 0;
          (a.allItems || []).forEach(function (g) {
            var d = g.pageIx || 0,
              n = g._legendItemPos ? g._legendItemPos[1] : 0,
              f = g.legendItem ? Math.round(g.legendItem.getBBox().height) : 0;
            d = n + f - a.pages[d] > b || d !== c - 1;
            g.a11yProxyElement &&
              (g.a11yProxyElement.style.visibility = d ? "hidden" : "visible");
          });
        },
        onChartRender: function () {
          m(this.chart) ? this.updateProxiesPositions() : this.removeProxies();
        },
        onChartUpdate: function () {
          this.updateLegendTitle();
        },
        updateProxiesPositions: function () {
          for (var a = 0, c = this.proxyElementsList; a < c.length; a++) {
            var b = c[a];
            this.updateProxyButtonPosition(b.element, b.posElement);
          }
        },
        updateProxyPositionForItem: function (a) {
          var c = g(this.proxyElementsList, function (c) {
            return c.item === a;
          });
          c && this.updateProxyButtonPosition(c.element, c.posElement);
        },
        recreateProxies: function () {
          this.removeProxies();
          m(this.chart) &&
            (this.addLegendProxyGroup(),
            this.addLegendListContainer(),
            this.proxyLegendItems(),
            this.updateLegendItemProxyVisibility());
        },
        removeProxies: function () {
          d(this.legendProxyGroup);
          this.proxyElementsList = [];
        },
        updateLegendTitle: function () {
          var a = this.chart,
            c = f(
              (
                (a.legend &&
                  a.legend.options.title &&
                  a.legend.options.title.text) ||
                ""
              ).replace(/<br ?\/?>/g, " ")
            );
          a = a.langFormat(
            "accessibility.legend.legendLabel" + (c ? "" : "NoTitle"),
            { chart: a, legendTitle: c }
          );
          this.legendProxyGroup &&
            this.legendProxyGroup.setAttribute("aria-label", a);
        },
        addLegendProxyGroup: function () {
          this.legendProxyGroup = this.addProxyGroup({
            "aria-label": "_placeholder_",
            role:
              "all" === this.chart.options.accessibility.landmarkVerbosity
                ? "region"
                : null,
          });
        },
        addLegendListContainer: function () {
          if (this.legendProxyGroup) {
            var a = (this.legendListContainer = this.createElement("ul"));
            a.style.listStyle = "none";
            this.legendProxyGroup.appendChild(a);
          }
        },
        proxyLegendItems: function () {
          var a = this;
          ((this.chart.legend && this.chart.legend.allItems) || []).forEach(
            function (c) {
              c.legendItem && c.legendItem.element && a.proxyLegendItem(c);
            }
          );
        },
        proxyLegendItem: function (a) {
          if (a.legendItem && a.legendGroup && this.legendListContainer) {
            var c = this.chart.langFormat("accessibility.legend.legendItem", {
              chart: this.chart,
              itemName: f(a.name),
              item: a,
            });
            c = { tabindex: -1, "aria-pressed": a.visible, "aria-label": c };
            var b = a.legendGroup.div ? a.legendItem : a.legendGroup,
              g = this.createElement("li");
            this.legendListContainer.appendChild(g);
            a.a11yProxyElement = this.createProxyButton(a.legendItem, g, c, b);
            this.proxyElementsList.push({
              item: a,
              element: a.a11yProxyElement,
              posElement: b,
            });
          }
        },
        getKeyboardNavigation: function () {
          var a = this.keyCodes,
            c = this,
            b = this.chart;
          return new t(b, {
            keyCodeMap: [
              [
                [a.left, a.right, a.up, a.down],
                function (a) {
                  return c.onKbdArrowKey(this, a);
                },
              ],
              [
                [a.enter, a.space],
                function (b) {
                  return e.isFirefox && b === a.space
                    ? this.response.success
                    : c.onKbdClick(this);
                },
              ],
            ],
            validate: function () {
              return c.shouldHaveLegendNavigation();
            },
            init: function (a) {
              return c.onKbdNavigationInit(a);
            },
            terminate: function () {
              b.legend.allItems.forEach(function (a) {
                return a.setState("", !0);
              });
            },
          });
        },
        onKbdArrowKey: function (a, c) {
          var b = this.keyCodes,
            g = a.response,
            d = this.chart,
            f = d.options.accessibility,
            n = d.legend.allItems.length;
          c = c === b.left || c === b.up ? -1 : 1;
          return d.highlightLegendItem(this.highlightedLegendItemIx + c)
            ? ((this.highlightedLegendItemIx += c), g.success)
            : 1 < n && f.keyboardNavigation.wrapAround
            ? (a.init(c), g.success)
            : g[0 < c ? "next" : "prev"];
        },
        onKbdClick: function (c) {
          var b = this.chart.legend.allItems[this.highlightedLegendItemIx];
          b && b.a11yProxyElement && a(b.a11yProxyElement, "click");
          return c.response.success;
        },
        shouldHaveLegendNavigation: function () {
          var a = this.chart,
            c = a.colorAxis && a.colorAxis.length,
            b = (a.options.legend || {}).accessibility || {};
          return !!(
            a.legend &&
            a.legend.allItems &&
            a.legend.display &&
            !c &&
            b.enabled &&
            b.keyboardNavigation &&
            b.keyboardNavigation.enabled
          );
        },
        onKbdNavigationInit: function (a) {
          var c = this.chart,
            b = c.legend.allItems.length - 1;
          a = 0 < a ? 0 : b;
          c.highlightLegendItem(a);
          this.highlightedLegendItemIx = a;
        },
      });
      return b;
    }
  );
  v(
    b,
    "Accessibility/Components/MenuComponent.js",
    [
      b["Core/Chart/Chart.js"],
      b["Core/Utilities.js"],
      b["Accessibility/AccessibilityComponent.js"],
      b["Accessibility/KeyboardNavigationHandler.js"],
      b["Accessibility/Utils/ChartUtilities.js"],
      b["Accessibility/Utils/HTMLUtilities.js"],
    ],
    function (b, e, r, p, u, t) {
      function l(b) {
        return b.exportSVGElements && b.exportSVGElements[0];
      }
      e = e.extend;
      var m = u.unhideChartElementFromAT,
        h = t.removeElement,
        q = t.getFakeMouseEvent;
      b.prototype.showExportMenu = function () {
        var b = l(this);
        if (b && ((b = b.element), b.onclick)) b.onclick(q("click"));
      };
      b.prototype.hideExportMenu = function () {
        var b = this.exportDivElements;
        b &&
          this.exportContextMenu &&
          (b.forEach(function (a) {
            if ("highcharts-menu-item" === a.className && a.onmouseout)
              a.onmouseout(q("mouseout"));
          }),
          (this.highlightedExportItemIx = 0),
          this.exportContextMenu.hideMenu(),
          this.container.focus());
      };
      b.prototype.highlightExportItem = function (b) {
        var a = this.exportDivElements && this.exportDivElements[b],
          c =
            this.exportDivElements &&
            this.exportDivElements[this.highlightedExportItemIx];
        if (a && "LI" === a.tagName && (!a.children || !a.children.length)) {
          var g = !!(this.renderTo.getElementsByTagName("g")[0] || {}).focus;
          a.focus && g && a.focus();
          if (c && c.onmouseout) c.onmouseout(q("mouseout"));
          if (a.onmouseover) a.onmouseover(q("mouseover"));
          this.highlightedExportItemIx = b;
          return !0;
        }
        return !1;
      };
      b.prototype.highlightLastExportItem = function () {
        var b;
        if (this.exportDivElements)
          for (b = this.exportDivElements.length; b--; )
            if (this.highlightExportItem(b)) return !0;
        return !1;
      };
      b = function () {};
      b.prototype = new r();
      e(b.prototype, {
        init: function () {
          var b = this.chart,
            a = this;
          this.addEvent(b, "exportMenuShown", function () {
            a.onMenuShown();
          });
          this.addEvent(b, "exportMenuHidden", function () {
            a.onMenuHidden();
          });
        },
        onMenuHidden: function () {
          var b = this.chart.exportContextMenu;
          b && b.setAttribute("aria-hidden", "true");
          this.isExportMenuShown = !1;
          this.setExportButtonExpandedState("false");
        },
        onMenuShown: function () {
          var b = this.chart,
            a = b.exportContextMenu;
          a && (this.addAccessibleContextMenuAttribs(), m(b, a));
          this.isExportMenuShown = !0;
          this.setExportButtonExpandedState("true");
        },
        setExportButtonExpandedState: function (b) {
          var a = this.exportButtonProxy;
          a && a.setAttribute("aria-expanded", b);
        },
        onChartRender: function () {
          var b = this.chart,
            a = b.options.accessibility;
          h(this.exportProxyGroup);
          var c = b.options.exporting,
            d = l(b);
          c &&
            !1 !== c.enabled &&
            c.accessibility &&
            c.accessibility.enabled &&
            d &&
            d.element &&
            ((this.exportProxyGroup = this.addProxyGroup(
              "all" === a.landmarkVerbosity
                ? {
                    "aria-label": b.langFormat(
                      "accessibility.exporting.exportRegionLabel",
                      { chart: b }
                    ),
                    role: "region",
                  }
                : {}
            )),
            (a = l(this.chart)),
            (this.exportButtonProxy = this.createProxyButton(
              a,
              this.exportProxyGroup,
              {
                "aria-label": b.langFormat(
                  "accessibility.exporting.menuButtonLabel",
                  { chart: b }
                ),
                "aria-expanded": !1,
              }
            )));
        },
        addAccessibleContextMenuAttribs: function () {
          var b = this.chart,
            a = b.exportDivElements;
          a &&
            a.length &&
            (a.forEach(function (a) {
              "LI" !== a.tagName || (a.children && a.children.length)
                ? a.setAttribute("aria-hidden", "true")
                : a.setAttribute("tabindex", -1);
            }),
            (a = a[0].parentNode),
            a.removeAttribute("aria-hidden"),
            a.setAttribute(
              "aria-label",
              b.langFormat("accessibility.exporting.chartMenuLabel", {
                chart: b,
              })
            ));
        },
        getKeyboardNavigation: function () {
          var b = this.keyCodes,
            a = this.chart,
            c = this;
          return new p(a, {
            keyCodeMap: [
              [
                [b.left, b.up],
                function () {
                  return c.onKbdPrevious(this);
                },
              ],
              [
                [b.right, b.down],
                function () {
                  return c.onKbdNext(this);
                },
              ],
              [
                [b.enter, b.space],
                function () {
                  return c.onKbdClick(this);
                },
              ],
            ],
            validate: function () {
              return (
                a.exportChart &&
                !1 !== a.options.exporting.enabled &&
                !1 !== a.options.exporting.accessibility.enabled
              );
            },
            init: function () {
              var b = c.exportButtonProxy,
                g = a.exportingGroup;
              g && b && a.setFocusToElement(g, b);
            },
            terminate: function () {
              a.hideExportMenu();
            },
          });
        },
        onKbdPrevious: function (b) {
          var a = this.chart,
            c = a.options.accessibility;
          b = b.response;
          for (var d = a.highlightedExportItemIx || 0; d--; )
            if (a.highlightExportItem(d)) return b.success;
          return c.keyboardNavigation.wrapAround
            ? (a.highlightLastExportItem(), b.success)
            : b.prev;
        },
        onKbdNext: function (b) {
          var a = this.chart,
            c = a.options.accessibility;
          b = b.response;
          for (
            var d = (a.highlightedExportItemIx || 0) + 1;
            d < a.exportDivElements.length;
            ++d
          )
            if (a.highlightExportItem(d)) return b.success;
          return c.keyboardNavigation.wrapAround
            ? (a.highlightExportItem(0), b.success)
            : b.next;
        },
        onKbdClick: function (b) {
          var a = this.chart,
            c = a.exportDivElements[a.highlightedExportItemIx],
            d = l(a).element;
          this.isExportMenuShown
            ? this.fakeClickEvent(c)
            : (this.fakeClickEvent(d), a.highlightExportItem(0));
          return b.response.success;
        },
      });
      return b;
    }
  );
  v(
    b,
    "Accessibility/Components/SeriesComponent/SeriesKeyboardNavigation.js",
    [
      b["Core/Chart/Chart.js"],
      b["Core/Series/Point.js"],
      b["Core/Series/Series.js"],
      b["Core/Series/SeriesRegistry.js"],
      b["Core/Globals.js"],
      b["Core/Utilities.js"],
      b["Accessibility/KeyboardNavigationHandler.js"],
      b["Accessibility/Utils/EventProvider.js"],
      b["Accessibility/Utils/ChartUtilities.js"],
    ],
    function (b, e, r, p, u, t, l, m, h) {
      function q(a) {
        var c = a.index,
          b = a.series.points,
          d = b.length;
        if (b[c] !== a)
          for (; d--; ) {
            if (b[d] === a) return d;
          }
        else return c;
      }
      function g(a) {
        var c =
            a.chart.options.accessibility.keyboardNavigation.seriesNavigation,
          b = a.options.accessibility || {},
          d = b.keyboardNavigation;
        return (
          (d && !1 === d.enabled) ||
          !1 === b.enabled ||
          !1 === a.options.enableMouseTracking ||
          !a.visible ||
          (c.pointNavigationEnabledThreshold &&
            c.pointNavigationEnabledThreshold <= a.points.length)
        );
      }
      function a(a) {
        var c = a.series.chart.options.accessibility,
          b = a.options.accessibility && !1 === a.options.accessibility.enabled;
        return (
          (a.isNull && c.keyboardNavigation.seriesNavigation.skipNullPoints) ||
          !1 === a.visible ||
          !1 === a.isInside ||
          b ||
          g(a.series)
        );
      }
      function c(a, c, b, d) {
        var g = Infinity,
          f = c.points.length,
          y = function (a) {
            return !(C(a.plotX) && C(a.plotY));
          };
        if (!y(a)) {
          for (; f--; ) {
            var k = c.points[f];
            if (
              !y(k) &&
              ((k =
                (a.plotX - k.plotX) * (a.plotX - k.plotX) * (b || 1) +
                (a.plotY - k.plotY) * (a.plotY - k.plotY) * (d || 1)),
              k < g)
            ) {
              g = k;
              var A = f;
            }
          }
          return C(A) ? c.points[A] : void 0;
        }
      }
      function d(a) {
        var c = !1;
        delete a.highlightedPoint;
        return (c = a.series.reduce(function (a, c) {
          return a || c.highlightFirstValidPoint();
        }, !1));
      }
      function f(a, c) {
        this.keyCodes = c;
        this.chart = a;
      }
      var n = p.seriesTypes,
        E = u.doc,
        C = t.defined;
      p = t.extend;
      var w = t.fireEvent,
        v = h.getPointFromXY,
        H = h.getSeriesFromName,
        F = h.scrollToPoint;
      r.prototype.keyboardMoveVertical = !0;
      ["column", "pie"].forEach(function (a) {
        n[a] && (n[a].prototype.keyboardMoveVertical = !1);
      });
      e.prototype.highlight = function () {
        var a = this.series.chart;
        if (this.isNull) a.tooltip && a.tooltip.hide(0);
        else this.onMouseOver();
        F(this);
        this.graphic && a.setFocusToElement(this.graphic);
        a.highlightedPoint = this;
        return this;
      };
      b.prototype.highlightAdjacentPoint = function (c) {
        var b = this.series,
          d = this.highlightedPoint,
          f = (d && q(d)) || 0,
          n = d && d.series.points,
          h = this.series && this.series[this.series.length - 1];
        h = h && h.points && h.points[h.points.length - 1];
        if (!b[0] || !b[0].points) return !1;
        if (d) {
          if (
            ((b = b[d.series.index + (c ? 1 : -1)]),
            (f = n[f + (c ? 1 : -1)]),
            !f && b && (f = b.points[c ? 0 : b.points.length - 1]),
            !f)
          )
            return !1;
        } else f = c ? b[0].points[0] : h;
        return a(f)
          ? ((b = f.series),
            g(b)
              ? (this.highlightedPoint = c
                  ? b.points[b.points.length - 1]
                  : b.points[0])
              : (this.highlightedPoint = f),
            this.highlightAdjacentPoint(c))
          : f.highlight();
      };
      r.prototype.highlightFirstValidPoint = function () {
        var c = this.chart.highlightedPoint,
          b = (c && c.series) === this ? q(c) : 0;
        c = this.points;
        var d = c.length;
        if (c && d) {
          for (var f = b; f < d; ++f) if (!a(c[f])) return c[f].highlight();
          for (; 0 <= b; --b) if (!a(c[b])) return c[b].highlight();
        }
        return !1;
      };
      b.prototype.highlightAdjacentSeries = function (a) {
        var b = this.highlightedPoint,
          d = this.series && this.series[this.series.length - 1],
          f = d && d.points && d.points[d.points.length - 1];
        if (!this.highlightedPoint)
          return (
            (d = a ? this.series && this.series[0] : d),
            (f = a ? d && d.points && d.points[0] : f) ? f.highlight() : !1
          );
        d = this.series[b.series.index + (a ? -1 : 1)];
        if (!d) return !1;
        f = c(b, d, 4);
        if (!f) return !1;
        if (g(d))
          return (
            f.highlight(),
            (a = this.highlightAdjacentSeries(a)),
            a ? a : (b.highlight(), !1)
          );
        f.highlight();
        return f.series.highlightFirstValidPoint();
      };
      b.prototype.highlightAdjacentPointVertical = function (c) {
        var b = this.highlightedPoint,
          d = Infinity,
          f;
        if (!C(b.plotX) || !C(b.plotY)) return !1;
        this.series.forEach(function (h) {
          g(h) ||
            h.points.forEach(function (g) {
              if (C(g.plotY) && C(g.plotX) && g !== b) {
                var n = g.plotY - b.plotY,
                  k = Math.abs(g.plotX - b.plotX);
                k = Math.abs(n) * Math.abs(n) + k * k * 4;
                h.yAxis && h.yAxis.reversed && (n *= -1);
                !((0 >= n && c) || (0 <= n && !c) || 5 > k || a(g)) &&
                  k < d &&
                  ((d = k), (f = g));
              }
            });
        });
        return f ? f.highlight() : !1;
      };
      p(f.prototype, {
        init: function () {
          var a = this,
            c = this.chart,
            b = (this.eventProvider = new m());
          b.addEvent(r, "destroy", function () {
            return a.onSeriesDestroy(this);
          });
          b.addEvent(c, "afterDrilldown", function () {
            d(this);
            this.focusElement && this.focusElement.removeFocusBorder();
          });
          b.addEvent(c, "drilldown", function (c) {
            c = c.point;
            var b = c.series;
            a.lastDrilledDownPoint = {
              x: c.x,
              y: c.y,
              seriesName: b ? b.name : "",
            };
          });
          b.addEvent(c, "drillupall", function () {
            setTimeout(function () {
              a.onDrillupAll();
            }, 10);
          });
          b.addEvent(e, "afterSetState", function () {
            var a = this.graphic && this.graphic.element;
            c.highlightedPoint === this &&
              E.activeElement !== a &&
              a &&
              a.focus &&
              a.focus();
          });
        },
        onDrillupAll: function () {
          var a = this.lastDrilledDownPoint,
            c = this.chart,
            b = a && H(c, a.seriesName),
            d;
          a && b && C(a.x) && C(a.y) && (d = v(b, a.x, a.y));
          c.container && c.container.focus();
          d && d.highlight && d.highlight();
          c.focusElement && c.focusElement.removeFocusBorder();
        },
        getKeyboardNavigationHandler: function () {
          var a = this,
            c = this.keyCodes,
            b = this.chart,
            d = b.inverted;
          return new l(b, {
            keyCodeMap: [
              [
                d ? [c.up, c.down] : [c.left, c.right],
                function (c) {
                  return a.onKbdSideways(this, c);
                },
              ],
              [
                d ? [c.left, c.right] : [c.up, c.down],
                function (c) {
                  return a.onKbdVertical(this, c);
                },
              ],
              [
                [c.enter, c.space],
                function (a, c) {
                  if ((a = b.highlightedPoint))
                    (c.point = a),
                      w(a.series, "click", c),
                      a.firePointEvent("click");
                  return this.response.success;
                },
              ],
            ],
            init: function (c) {
              return a.onHandlerInit(this, c);
            },
            terminate: function () {
              return a.onHandlerTerminate();
            },
          });
        },
        onKbdSideways: function (a, c) {
          var b = this.keyCodes;
          return this.attemptHighlightAdjacentPoint(
            a,
            c === b.right || c === b.down
          );
        },
        onKbdVertical: function (a, c) {
          var b = this.chart,
            d = this.keyCodes;
          c = c === d.down || c === d.right;
          d = b.options.accessibility.keyboardNavigation.seriesNavigation;
          if (d.mode && "serialize" === d.mode)
            return this.attemptHighlightAdjacentPoint(a, c);
          b[
            b.highlightedPoint && b.highlightedPoint.series.keyboardMoveVertical
              ? "highlightAdjacentPointVertical"
              : "highlightAdjacentSeries"
          ](c);
          return a.response.success;
        },
        onHandlerInit: function (a, c) {
          var b = this.chart;
          if (0 < c) d(b);
          else {
            c = b.series.length;
            for (
              var f;
              c-- &&
              !((b.highlightedPoint =
                b.series[c].points[b.series[c].points.length - 1]),
              (f = b.series[c].highlightFirstValidPoint()));

            );
          }
          return a.response.success;
        },
        onHandlerTerminate: function () {
          var a = this.chart;
          a.tooltip && a.tooltip.hide(0);
          var c = a.highlightedPoint && a.highlightedPoint.series;
          if (c && c.onMouseOut) c.onMouseOut();
          if (a.highlightedPoint && a.highlightedPoint.onMouseOut)
            a.highlightedPoint.onMouseOut();
          delete a.highlightedPoint;
        },
        attemptHighlightAdjacentPoint: function (a, c) {
          var b = this.chart,
            d = b.options.accessibility.keyboardNavigation.wrapAround;
          return b.highlightAdjacentPoint(c)
            ? a.response.success
            : d
            ? a.init(c ? 1 : -1)
            : a.response[c ? "next" : "prev"];
        },
        onSeriesDestroy: function (a) {
          var c = this.chart;
          c.highlightedPoint &&
            c.highlightedPoint.series === a &&
            (delete c.highlightedPoint,
            c.focusElement && c.focusElement.removeFocusBorder());
        },
        destroy: function () {
          this.eventProvider.removeAddedEvents();
        },
      });
      return f;
    }
  );
  v(
    b,
    "Accessibility/Components/AnnotationsA11y.js",
    [b["Accessibility/Utils/HTMLUtilities.js"]],
    function (b) {
      function e(b) {
        return (b.annotations || []).reduce(function (b, m) {
          m.options && !1 !== m.options.visible && (b = b.concat(m.labels));
          return b;
        }, []);
      }
      function r(b) {
        return (
          (b.options &&
            b.options.accessibility &&
            b.options.accessibility.description) ||
          (b.graphic && b.graphic.text && b.graphic.text.textStr) ||
          ""
        );
      }
      function p(b) {
        var h =
          b.options &&
          b.options.accessibility &&
          b.options.accessibility.description;
        if (h) return h;
        h = b.chart;
        var m = r(b),
          g = b.points
            .filter(function (a) {
              return !!a.graphic;
            })
            .map(function (a) {
              var c =
                (a.accessibility && a.accessibility.valueDescription) ||
                (a.graphic &&
                  a.graphic.element &&
                  a.graphic.element.getAttribute("aria-label")) ||
                "";
              a = (a && a.series.name) || "";
              return (a ? a + ", " : "") + "data point " + c;
            })
            .filter(function (a) {
              return !!a;
            }),
          a = g.length,
          c =
            "accessibility.screenReaderSection.annotations.description" +
            (1 < a ? "MultiplePoints" : a ? "SinglePoint" : "NoPoints");
        b = {
          annotationText: m,
          annotation: b,
          numPoints: a,
          annotationPoint: g[0],
          additionalAnnotationPoints: g.slice(1),
        };
        return h.langFormat(c, b);
      }
      function u(b) {
        return e(b).map(function (b) {
          return (b = t(l(p(b)))) ? "<li>" + b + "</li>" : "";
        });
      }
      var t = b.escapeStringForHTML,
        l = b.stripHTMLTagsFromString;
      return {
        getAnnotationsInfoHTML: function (b) {
          var h = b.annotations;
          return h && h.length
            ? '<ul style="list-style-type: none">' + u(b).join(" ") + "</ul>"
            : "";
        },
        getAnnotationLabelDescription: p,
        getAnnotationListItems: u,
        getPointAnnotationTexts: function (b) {
          var h = e(b.series.chart).filter(function (h) {
            return -1 < h.points.indexOf(b);
          });
          return h.length
            ? h.map(function (b) {
                return "" + r(b);
              })
            : [];
        },
      };
    }
  );
  v(
    b,
    "Accessibility/Components/SeriesComponent/SeriesDescriber.js",
    [
      b["Accessibility/Components/AnnotationsA11y.js"],
      b["Accessibility/Utils/ChartUtilities.js"],
      b["Core/FormatUtilities.js"],
      b["Accessibility/Utils/HTMLUtilities.js"],
      b["Core/Tooltip.js"],
      b["Core/Utilities.js"],
    ],
    function (b, e, r, p, u, t) {
      function l(a) {
        var b = a.index;
        return a.series && a.series.data && I(b)
          ? A(a.series.data, function (a) {
              return !!(
                a &&
                "undefined" !== typeof a.index &&
                a.index > b &&
                a.graphic &&
                a.graphic.element
              );
            }) || null
          : null;
      }
      function m(a) {
        var b =
          a.chart.options.accessibility.series.pointDescriptionEnabledThreshold;
        return !!(!1 !== b && a.points && a.points.length >= b);
      }
      function h(a) {
        var b = a.options.accessibility || {};
        return !m(a) && !b.exposeAsGroupOnly;
      }
      function q(a) {
        var b =
          a.chart.options.accessibility.keyboardNavigation.seriesNavigation;
        return !(
          !a.points ||
          !(
            a.points.length < b.pointNavigationEnabledThreshold ||
            !1 === b.pointNavigationEnabledThreshold
          )
        );
      }
      function g(a, b) {
        var c = a.series.chart,
          k = c.options.accessibility.point || {};
        a = a.series.tooltipOptions || {};
        c = c.options.lang;
        return L(b)
          ? K(
              b,
              k.valueDecimals || a.valueDecimals || -1,
              c.decimalPoint,
              c.accessibility.thousandsSep || c.thousandsSep
            )
          : b;
      }
      function a(a) {
        var b = (a.options.accessibility || {}).description;
        return (
          (b &&
            a.chart.langFormat("accessibility.series.description", {
              description: b,
              series: a,
            })) ||
          ""
        );
      }
      function c(a, b) {
        return a.chart.langFormat("accessibility.series." + b + "Description", {
          name: B(a[b]),
          series: a,
        });
      }
      function d(a) {
        var b = a.series,
          c = b.chart,
          k = c.options.accessibility.point || {};
        if (b.xAxis && b.xAxis.dateTime)
          return (
            (b = u.prototype.getXDateFormat.call(
              { getDateFormat: u.prototype.getDateFormat, chart: c },
              a,
              c.options.tooltip,
              b.xAxis
            )),
            (k = (k.dateFormatter && k.dateFormatter(a)) || k.dateFormat || b),
            c.time.dateFormat(k, a.x, void 0)
          );
      }
      function f(a) {
        var b = d(a),
          c =
            (a.series.xAxis || {}).categories &&
            I(a.category) &&
            ("" + a.category).replace("<br/>", " "),
          k = a.id && 0 > a.id.indexOf("highcharts-"),
          f = "x, " + a.x;
        return a.name || b || c || (k ? a.id : f);
      }
      function n(a, b, c) {
        var k = b || "",
          d = c || "";
        return a.series.pointArrayMap.reduce(function (b, c) {
          b += b.length ? ", " : "";
          var f = g(a, G(a[c], a.options[c]));
          return b + (c + ": " + k + f + d);
        }, "");
      }
      function E(a) {
        var b = a.series,
          c = b.chart.options.accessibility.point || {},
          k = b.tooltipOptions || {},
          d = c.valuePrefix || k.valuePrefix || "";
        c = c.valueSuffix || k.valueSuffix || "";
        k = g(a, a["undefined" !== typeof a.value ? "value" : "y"]);
        return a.isNull
          ? b.chart.langFormat("accessibility.series.nullPointValue", {
              point: a,
            })
          : b.pointArrayMap
          ? n(a, d, c)
          : d + k + c;
      }
      function C(a) {
        var b = a.series,
          c = b.chart,
          k = c.options.accessibility.point.valueDescriptionFormat,
          d = (b = G(
            b.xAxis &&
              b.xAxis.options.accessibility &&
              b.xAxis.options.accessibility.enabled,
            !c.angular
          ))
            ? f(a)
            : "";
        a = {
          point: a,
          index: I(a.index) ? a.index + 1 : "",
          xDescription: d,
          value: E(a),
          separator: b ? ", " : "",
        };
        return z(k, a, c);
      }
      function w(a) {
        var b = a.series,
          c = b.chart,
          k = C(a),
          d =
            a.options &&
            a.options.accessibility &&
            a.options.accessibility.description;
        d = d ? " " + d : "";
        b = 1 < c.series.length && b.name ? " " + b.name + "." : "";
        c = a.series.chart;
        var f = F(a),
          g = { point: a, annotations: f };
        c = f.length
          ? c.langFormat("accessibility.series.pointAnnotationsDescription", g)
          : "";
        a.accessibility = a.accessibility || {};
        a.accessibility.valueDescription = k;
        return k + d + b + (c ? " " + c : "");
      }
      function v(a) {
        var b = h(a),
          c = q(a);
        (b || c) &&
          a.points.forEach(function (a) {
            var c;
            if (
              !(c = a.graphic && a.graphic.element) &&
              ((c = a.series && a.series.is("sunburst")), (c = a.isNull && !c))
            ) {
              var d = a.series,
                f = l(a);
              d = (c = f && f.graphic) ? c.parentGroup : d.graph || d.group;
              f = f
                ? { x: G(a.plotX, f.plotX, 0), y: G(a.plotY, f.plotY, 0) }
                : { x: G(a.plotX, 0), y: G(a.plotY, 0) };
              f = a.series.chart.renderer.rect(f.x, f.y, 1, 1);
              f.attr({
                class: "highcharts-a11y-dummy-point",
                fill: "none",
                opacity: 0,
                "fill-opacity": 0,
                "stroke-opacity": 0,
              });
              d && d.element
                ? ((a.graphic = f),
                  (a.hasDummyGraphic = !0),
                  f.add(d),
                  d.element.insertBefore(f.element, c ? c.element : null),
                  (c = f.element))
                : (c = void 0);
            }
            d =
              a.options &&
              a.options.accessibility &&
              !1 === a.options.accessibility.enabled;
            c &&
              (c.setAttribute("tabindex", "-1"),
              (c.style.outline = "0"),
              b && !d
                ? ((f = a.series),
                  (d = f.chart.options.accessibility.point || {}),
                  (f = f.options.accessibility || {}),
                  (a = k(
                    (f.pointDescriptionFormatter &&
                      f.pointDescriptionFormatter(a)) ||
                      (d.descriptionFormatter && d.descriptionFormatter(a)) ||
                      w(a)
                  )),
                  c.setAttribute("role", "img"),
                  c.setAttribute("aria-label", a))
                : c.setAttribute("aria-hidden", !0));
          });
      }
      function H(b) {
        var k = b.chart,
          d = k.types || [],
          f = a(b),
          g = function (a) {
            return k[a] && 1 < k[a].length && b[a];
          },
          A = c(b, "xAxis"),
          n = c(b, "yAxis"),
          h = {
            name: b.name || "",
            ix: b.index + 1,
            numSeries: k.series && k.series.length,
            numPoints: b.points && b.points.length,
            series: b,
          };
        d = 1 < d.length ? "Combination" : "";
        return (
          (k.langFormat("accessibility.series.summary." + b.type + d, h) ||
            k.langFormat("accessibility.series.summary.default" + d, h)) +
          (f ? " " + f : "") +
          (g("yAxis") ? " " + n : "") +
          (g("xAxis") ? " " + A : "")
        );
      }
      var F = b.getPointAnnotationTexts,
        B = e.getAxisDescription,
        D = e.getSeriesFirstPointElement,
        y = e.getSeriesA11yElement,
        x = e.unhideChartElementFromAT,
        z = r.format,
        K = r.numberFormat,
        M = p.reverseChildNodes,
        k = p.stripHTMLTagsFromString,
        A = t.find,
        L = t.isNumber,
        G = t.pick,
        I = t.defined;
      return {
        describeSeries: function (a) {
          var b = a.chart,
            c = D(a),
            d = y(a),
            f = b.is3d && b.is3d();
          if (d) {
            d.lastChild !== c || f || M(d);
            v(a);
            x(b, d);
            f = a.chart;
            b = f.options.chart;
            c = 1 < f.series.length;
            f = f.options.accessibility.series.describeSingleSeries;
            var g = (a.options.accessibility || {}).exposeAsGroupOnly;
            (b.options3d && b.options3d.enabled && c) || !(c || f || g || m(a))
              ? d.setAttribute("aria-label", "")
              : ((b = a.chart.options.accessibility),
                (c = b.landmarkVerbosity),
                (a.options.accessibility || {}).exposeAsGroupOnly
                  ? d.setAttribute("role", "img")
                  : "all" === c && d.setAttribute("role", "region"),
                d.setAttribute("tabindex", "-1"),
                (d.style.outline = "0"),
                d.setAttribute(
                  "aria-label",
                  k(
                    (b.series.descriptionFormatter &&
                      b.series.descriptionFormatter(a)) ||
                      H(a)
                  )
                ));
          }
        },
        defaultPointDescriptionFormatter: w,
        defaultSeriesDescriptionFormatter: H,
        getPointA11yTimeDescription: d,
        getPointXDescription: f,
        getPointValue: E,
        getPointValueDescription: C,
      };
    }
  );
  v(
    b,
    "Accessibility/Utils/Announcer.js",
    [
      b["Core/Globals.js"],
      b["Core/Renderer/HTML/AST.js"],
      b["Accessibility/Utils/DOMElementProvider.js"],
      b["Accessibility/Utils/HTMLUtilities.js"],
    ],
    function (b, e, r, p) {
      var u = b.doc,
        t = p.setElAttrs,
        l = p.visuallyHideElement;
      p = (function () {
        function b(b, q) {
          this.chart = b;
          this.domElementProvider = new r();
          this.announceRegion = this.addAnnounceRegion(q);
        }
        b.prototype.destroy = function () {
          this.domElementProvider.destroyCreatedElements();
        };
        b.prototype.announce = function (b) {
          var h = this;
          e.setElementHTML(this.announceRegion, b);
          this.clearAnnouncementRegionTimer &&
            clearTimeout(this.clearAnnouncementRegionTimer);
          this.clearAnnouncementRegionTimer = setTimeout(function () {
            h.announceRegion.innerHTML = "";
            delete h.clearAnnouncementRegionTimer;
          }, 1e3);
        };
        b.prototype.addAnnounceRegion = function (b) {
          var h =
              this.chart.announcerContainer || this.createAnnouncerContainer(),
            g = this.domElementProvider.createElement("div");
          t(g, { "aria-hidden": !1, "aria-live": b });
          l(g);
          h.appendChild(g);
          return g;
        };
        b.prototype.createAnnouncerContainer = function () {
          var b = this.chart,
            e = u.createElement("div");
          t(e, {
            "aria-hidden": !1,
            style: "position:relative",
            class: "highcharts-announcer-container",
          });
          b.renderTo.insertBefore(e, b.renderTo.firstChild);
          return (b.announcerContainer = e);
        };
        return b;
      })();
      return (b.Announcer = p);
    }
  );
  v(
    b,
    "Accessibility/Components/SeriesComponent/NewDataAnnouncer.js",
    [
      b["Core/Globals.js"],
      b["Core/Series/Series.js"],
      b["Core/Utilities.js"],
      b["Accessibility/Utils/ChartUtilities.js"],
      b["Accessibility/Components/SeriesComponent/SeriesDescriber.js"],
      b["Accessibility/Utils/Announcer.js"],
      b["Accessibility/Utils/EventProvider.js"],
    ],
    function (b, e, r, p, u, t, l) {
      function m(a) {
        var b = a.series.data.filter(function (b) {
          return a.x === b.x && a.y === b.y;
        });
        return 1 === b.length ? b[0] : a;
      }
      function h(a, b) {
        var c = (a || []).concat(b || []).reduce(function (a, b) {
          a[b.name + b.index] = b;
          return a;
        }, {});
        return Object.keys(c).map(function (a) {
          return c[a];
        });
      }
      var q = r.extend,
        g = r.defined,
        a = p.getChartTitle,
        c = u.defaultPointDescriptionFormatter,
        d = u.defaultSeriesDescriptionFormatter;
      r = function (a) {
        this.chart = a;
      };
      q(r.prototype, {
        init: function () {
          var a = this.chart,
            b = a.options.accessibility.announceNewData.interruptUser
              ? "assertive"
              : "polite";
          this.lastAnnouncementTime = 0;
          this.dirty = { allSeries: {} };
          this.eventProvider = new l();
          this.announcer = new t(a, b);
          this.addEventListeners();
        },
        destroy: function () {
          this.eventProvider.removeAddedEvents();
          this.announcer.destroy();
        },
        addEventListeners: function () {
          var a = this,
            b = this.chart,
            c = this.eventProvider;
          c.addEvent(b, "afterDrilldown", function () {
            a.lastAnnouncementTime = 0;
          });
          c.addEvent(e, "updatedData", function () {
            a.onSeriesUpdatedData(this);
          });
          c.addEvent(b, "afterAddSeries", function (b) {
            a.onSeriesAdded(b.series);
          });
          c.addEvent(e, "addPoint", function (b) {
            a.onPointAdded(b.point);
          });
          c.addEvent(b, "redraw", function () {
            a.announceDirtyData();
          });
        },
        onSeriesUpdatedData: function (a) {
          var b = this.chart;
          a.chart === b &&
            b.options.accessibility.announceNewData.enabled &&
            ((this.dirty.hasDirty = !0),
            (this.dirty.allSeries[a.name + a.index] = a));
        },
        onSeriesAdded: function (a) {
          this.chart.options.accessibility.announceNewData.enabled &&
            ((this.dirty.hasDirty = !0),
            (this.dirty.allSeries[a.name + a.index] = a),
            (this.dirty.newSeries = g(this.dirty.newSeries) ? void 0 : a));
        },
        onPointAdded: function (a) {
          var b = a.series.chart;
          this.chart === b &&
            b.options.accessibility.announceNewData.enabled &&
            (this.dirty.newPoint = g(this.dirty.newPoint) ? void 0 : a);
        },
        announceDirtyData: function () {
          var a = this;
          if (
            this.chart.options.accessibility.announceNewData &&
            this.dirty.hasDirty
          ) {
            var b = this.dirty.newPoint;
            b && (b = m(b));
            this.queueAnnouncement(
              Object.keys(this.dirty.allSeries).map(function (b) {
                return a.dirty.allSeries[b];
              }),
              this.dirty.newSeries,
              b
            );
            this.dirty = { allSeries: {} };
          }
        },
        queueAnnouncement: function (a, b, c) {
          var d = this,
            f = this.chart.options.accessibility.announceNewData;
          if (f.enabled) {
            var g = +new Date();
            f = Math.max(
              0,
              f.minAnnounceInterval - (g - this.lastAnnouncementTime)
            );
            a = h(this.queuedAnnouncement && this.queuedAnnouncement.series, a);
            if ((b = this.buildAnnouncementMessage(a, b, c)))
              this.queuedAnnouncement &&
                clearTimeout(this.queuedAnnouncementTimer),
                (this.queuedAnnouncement = { time: g, message: b, series: a }),
                (this.queuedAnnouncementTimer = setTimeout(function () {
                  d &&
                    d.announcer &&
                    ((d.lastAnnouncementTime = +new Date()),
                    d.announcer.announce(d.queuedAnnouncement.message),
                    delete d.queuedAnnouncement,
                    delete d.queuedAnnouncementTimer);
                }, f));
          }
        },
        buildAnnouncementMessage: function (f, g, h) {
          var n = this.chart,
            e = n.options.accessibility.announceNewData;
          if (
            e.announcementFormatter &&
            ((f = e.announcementFormatter(f, g, h)), !1 !== f)
          )
            return f.length ? f : null;
          f = b.charts && 1 < b.charts.length ? "Multiple" : "Single";
          f = g
            ? "newSeriesAnnounce" + f
            : h
            ? "newPointAnnounce" + f
            : "newDataAnnounce";
          e = a(n);
          return n.langFormat("accessibility.announceNewData." + f, {
            chartTitle: e,
            seriesDesc: g ? d(g) : null,
            pointDesc: h ? c(h) : null,
            point: h,
            series: g,
          });
        },
      });
      return r;
    }
  );
  v(
    b,
    "Accessibility/Components/SeriesComponent/ForcedMarkers.js",
    [b["Core/Series/Series.js"], b["Core/Utilities.js"]],
    function (b, e) {
      function r(b) {
        u(!0, b, {
          marker: { enabled: !0, states: { normal: { opacity: 0 } } },
        });
      }
      var p = e.addEvent,
        u = e.merge;
      return function () {
        p(b, "render", function () {
          var b = this.options,
            e =
              !1 !==
              (this.options.accessibility &&
                this.options.accessibility.enabled);
          if ((e = this.chart.options.accessibility.enabled && e))
            (e = this.chart.options.accessibility),
              (e =
                this.points.length <
                  e.series.pointDescriptionEnabledThreshold ||
                !1 === e.series.pointDescriptionEnabledThreshold);
          if (e) {
            if (
              (b.marker &&
                !1 === b.marker.enabled &&
                ((this.a11yMarkersForced = !0), r(this.options)),
              this._hasPointMarkers && this.points && this.points.length)
            )
              for (b = this.points.length; b--; ) {
                e = this.points[b];
                var m = e.options;
                delete e.hasForcedA11yMarker;
                m.marker &&
                  (m.marker.enabled
                    ? (u(!0, m.marker, {
                        states: {
                          normal: {
                            opacity:
                              (m.marker.states &&
                                m.marker.states.normal &&
                                m.marker.states.normal.opacity) ||
                              1,
                          },
                        },
                      }),
                      (e.hasForcedA11yMarker = !1))
                    : (r(m), (e.hasForcedA11yMarker = !0)));
              }
          } else this.a11yMarkersForced && (delete this.a11yMarkersForced, (b = this.resetA11yMarkerOptions) && u(!0, this.options, { marker: { enabled: b.enabled, states: { normal: { opacity: b.states && b.states.normal && b.states.normal.opacity } } } }));
        });
        p(b, "afterSetOptions", function (b) {
          this.resetA11yMarkerOptions = u(
            b.options.marker || {},
            this.userOptions.marker || {}
          );
        });
        p(b, "afterRender", function () {
          if (this.chart.styledMode) {
            if (this.markerGroup)
              this.markerGroup[
                this.a11yMarkersForced ? "addClass" : "removeClass"
              ]("highcharts-a11y-markers-hidden");
            this._hasPointMarkers &&
              this.points &&
              this.points.length &&
              this.points.forEach(function (b) {
                b.graphic &&
                  (b.graphic[
                    b.hasForcedA11yMarker ? "addClass" : "removeClass"
                  ]("highcharts-a11y-marker-hidden"),
                  b.graphic[
                    !1 === b.hasForcedA11yMarker ? "addClass" : "removeClass"
                  ]("highcharts-a11y-marker-visible"));
              });
          }
        });
      };
    }
  );
  v(
    b,
    "Accessibility/Components/SeriesComponent/SeriesComponent.js",
    [
      b["Core/Globals.js"],
      b["Core/Utilities.js"],
      b["Accessibility/AccessibilityComponent.js"],
      b["Accessibility/Components/SeriesComponent/SeriesKeyboardNavigation.js"],
      b["Accessibility/Components/SeriesComponent/NewDataAnnouncer.js"],
      b["Accessibility/Components/SeriesComponent/ForcedMarkers.js"],
      b["Accessibility/Utils/ChartUtilities.js"],
      b["Accessibility/Components/SeriesComponent/SeriesDescriber.js"],
      b["Core/Tooltip.js"],
    ],
    function (b, e, r, p, u, t, l, m, h) {
      e = e.extend;
      var q = l.hideSeriesFromAT,
        g = m.describeSeries;
      b.SeriesAccessibilityDescriber = m;
      t();
      b = function () {};
      b.prototype = new r();
      e(b.prototype, {
        init: function () {
          this.newDataAnnouncer = new u(this.chart);
          this.newDataAnnouncer.init();
          this.keyboardNavigation = new p(this.chart, this.keyCodes);
          this.keyboardNavigation.init();
          this.hideTooltipFromATWhenShown();
          this.hideSeriesLabelsFromATWhenShown();
        },
        hideTooltipFromATWhenShown: function () {
          var a = this;
          this.addEvent(h, "refresh", function () {
            this.chart === a.chart &&
              this.label &&
              this.label.element &&
              this.label.element.setAttribute("aria-hidden", !0);
          });
        },
        hideSeriesLabelsFromATWhenShown: function () {
          this.addEvent(this.chart, "afterDrawSeriesLabels", function () {
            this.series.forEach(function (a) {
              a.labelBySeries && a.labelBySeries.attr("aria-hidden", !0);
            });
          });
        },
        onChartRender: function () {
          this.chart.series.forEach(function (a) {
            !1 !==
              (a.options.accessibility && a.options.accessibility.enabled) &&
            a.visible
              ? g(a)
              : q(a);
          });
        },
        getKeyboardNavigation: function () {
          return this.keyboardNavigation.getKeyboardNavigationHandler();
        },
        destroy: function () {
          this.newDataAnnouncer.destroy();
          this.keyboardNavigation.destroy();
        },
      });
      return b;
    }
  );
  v(
    b,
    "Accessibility/Components/ZoomComponent.js",
    [
      b["Accessibility/AccessibilityComponent.js"],
      b["Accessibility/Utils/ChartUtilities.js"],
      b["Core/Globals.js"],
      b["Accessibility/Utils/HTMLUtilities.js"],
      b["Accessibility/KeyboardNavigationHandler.js"],
      b["Core/Utilities.js"],
    ],
    function (b, e, r, p, u, t) {
      var l = e.unhideChartElementFromAT;
      e = r.noop;
      var m = p.removeElement,
        h = p.setElAttrs;
      p = t.extend;
      var q = t.pick;
      r.Axis.prototype.panStep = function (b, a) {
        var c = a || 3;
        a = this.getExtremes();
        var d = ((a.max - a.min) / c) * b;
        c = a.max + d;
        d = a.min + d;
        var f = c - d;
        0 > b && d < a.dataMin
          ? ((d = a.dataMin), (c = d + f))
          : 0 < b && c > a.dataMax && ((c = a.dataMax), (d = c - f));
        this.setExtremes(d, c);
      };
      e.prototype = new b();
      p(e.prototype, {
        init: function () {
          var b = this,
            a = this.chart;
          ["afterShowResetZoom", "afterDrilldown", "drillupall"].forEach(
            function (c) {
              b.addEvent(a, c, function () {
                b.updateProxyOverlays();
              });
            }
          );
        },
        onChartUpdate: function () {
          var b = this.chart,
            a = this;
          b.mapNavButtons &&
            b.mapNavButtons.forEach(function (c, d) {
              l(b, c.element);
              a.setMapNavButtonAttrs(
                c.element,
                "accessibility.zoom.mapZoom" + (d ? "Out" : "In")
              );
            });
        },
        setMapNavButtonAttrs: function (b, a) {
          var c = this.chart;
          a = c.langFormat(a, { chart: c });
          h(b, { tabindex: -1, role: "button", "aria-label": a });
        },
        onChartRender: function () {
          this.updateProxyOverlays();
        },
        updateProxyOverlays: function () {
          var b = this.chart;
          m(this.drillUpProxyGroup);
          m(this.resetZoomProxyGroup);
          b.resetZoomButton &&
            this.recreateProxyButtonAndGroup(
              b.resetZoomButton,
              "resetZoomProxyButton",
              "resetZoomProxyGroup",
              b.langFormat("accessibility.zoom.resetZoomButton", { chart: b })
            );
          b.drillUpButton &&
            this.recreateProxyButtonAndGroup(
              b.drillUpButton,
              "drillUpProxyButton",
              "drillUpProxyGroup",
              b.langFormat("accessibility.drillUpButton", {
                chart: b,
                buttonText: b.getDrilldownBackText(),
              })
            );
        },
        recreateProxyButtonAndGroup: function (b, a, c, d) {
          m(this[c]);
          this[c] = this.addProxyGroup();
          this[a] = this.createProxyButton(b, this[c], {
            "aria-label": d,
            tabindex: -1,
          });
        },
        getMapZoomNavigation: function () {
          var b = this.keyCodes,
            a = this.chart,
            c = this;
          return new u(a, {
            keyCodeMap: [
              [
                [b.up, b.down, b.left, b.right],
                function (a) {
                  return c.onMapKbdArrow(this, a);
                },
              ],
              [
                [b.tab],
                function (a, b) {
                  return c.onMapKbdTab(this, b);
                },
              ],
              [
                [b.space, b.enter],
                function () {
                  return c.onMapKbdClick(this);
                },
              ],
            ],
            validate: function () {
              return !!(a.mapZoom && a.mapNavButtons && a.mapNavButtons.length);
            },
            init: function (a) {
              return c.onMapNavInit(a);
            },
          });
        },
        onMapKbdArrow: function (b, a) {
          var c = this.keyCodes;
          this.chart[a === c.up || a === c.down ? "yAxis" : "xAxis"][0].panStep(
            a === c.left || a === c.up ? -1 : 1
          );
          return b.response.success;
        },
        onMapKbdTab: function (b, a) {
          var c = this.chart;
          b = b.response;
          var d =
            ((a = a.shiftKey) && !this.focusedMapNavButtonIx) ||
            (!a && this.focusedMapNavButtonIx);
          c.mapNavButtons[this.focusedMapNavButtonIx].setState(0);
          if (d) return c.mapZoom(), b[a ? "prev" : "next"];
          this.focusedMapNavButtonIx += a ? -1 : 1;
          a = c.mapNavButtons[this.focusedMapNavButtonIx];
          c.setFocusToElement(a.box, a.element);
          a.setState(2);
          return b.success;
        },
        onMapKbdClick: function (b) {
          this.fakeClickEvent(
            this.chart.mapNavButtons[this.focusedMapNavButtonIx].element
          );
          return b.response.success;
        },
        onMapNavInit: function (b) {
          var a = this.chart,
            c = a.mapNavButtons[0],
            d = a.mapNavButtons[1];
          c = 0 < b ? c : d;
          a.setFocusToElement(c.box, c.element);
          c.setState(2);
          this.focusedMapNavButtonIx = 0 < b ? 0 : 1;
        },
        simpleButtonNavigation: function (b, a, c) {
          var d = this.keyCodes,
            f = this,
            g = this.chart;
          return new u(g, {
            keyCodeMap: [
              [
                [d.tab, d.up, d.down, d.left, d.right],
                function (a, b) {
                  return this.response[
                    (a === d.tab && b.shiftKey) || a === d.left || a === d.up
                      ? "prev"
                      : "next"
                  ];
                },
              ],
              [
                [d.space, d.enter],
                function () {
                  var a = c(this, g);
                  return q(a, this.response.success);
                },
              ],
            ],
            validate: function () {
              return g[b] && g[b].box && f[a];
            },
            init: function () {
              g.setFocusToElement(g[b].box, f[a]);
            },
          });
        },
        getKeyboardNavigation: function () {
          return [
            this.simpleButtonNavigation(
              "resetZoomButton",
              "resetZoomProxyButton",
              function (b, a) {
                a.zoomOut();
              }
            ),
            this.simpleButtonNavigation(
              "drillUpButton",
              "drillUpProxyButton",
              function (b, a) {
                a.drillUp();
                return b.response.prev;
              }
            ),
            this.getMapZoomNavigation(),
          ];
        },
      });
      return e;
    }
  );
  v(
    b,
    "Extensions/RangeSelector.js",
    [
      b["Core/Axis/Axis.js"],
      b["Core/Chart/Chart.js"],
      b["Core/Globals.js"],
      b["Core/DefaultOptions.js"],
      b["Core/Color/Palette.js"],
      b["Core/Renderer/SVG/SVGElement.js"],
      b["Core/Utilities.js"],
    ],
    function (b, e, r, p, u, t, l) {
      function m(a) {
        if (-1 !== a.indexOf("%L")) return "text";
        var b = "aAdewbBmoyY".split("").some(function (b) {
            return -1 !== a.indexOf("%" + b);
          }),
          c = "HkIlMS".split("").some(function (b) {
            return -1 !== a.indexOf("%" + b);
          });
        return b && c ? "datetime-local" : b ? "date" : c ? "time" : "text";
      }
      var h = p.defaultOptions,
        q = l.addEvent,
        g = l.createElement,
        a = l.css,
        c = l.defined,
        d = l.destroyObjectProperties,
        f = l.discardElement,
        n = l.extend,
        E = l.find,
        C = l.fireEvent,
        w = l.isNumber,
        v = l.merge,
        H = l.objectEach,
        F = l.pad,
        B = l.pick,
        D = l.pInt,
        y = l.splat;
      n(h, {
        rangeSelector: {
          allButtonsEnabled: !1,
          buttons: void 0,
          buttonSpacing: 5,
          dropdown: "responsive",
          enabled: void 0,
          verticalAlign: "top",
          buttonTheme: { width: 28, height: 18, padding: 2, zIndex: 7 },
          floating: !1,
          x: 0,
          y: 0,
          height: void 0,
          inputBoxBorderColor: "none",
          inputBoxHeight: 17,
          inputBoxWidth: void 0,
          inputDateFormat: "%b %e, %Y",
          inputDateParser: void 0,
          inputEditDateFormat: "%Y-%m-%d",
          inputEnabled: !0,
          inputPosition: { align: "right", x: 0, y: 0 },
          inputSpacing: 5,
          selected: void 0,
          buttonPosition: { align: "left", x: 0, y: 0 },
          inputStyle: { color: u.highlightColor80, cursor: "pointer" },
          labelStyle: { color: u.neutralColor60 },
        },
      });
      n(h.lang, {
        rangeSelectorZoom: "Zoom",
        rangeSelectorFrom: "",
        rangeSelectorTo: "\u2192",
      });
      var x = (function () {
        function e(a) {
          this.buttons = void 0;
          this.buttonOptions = e.prototype.defaultButtons;
          this.initialButtonGroupWidth = 0;
          this.options = void 0;
          this.chart = a;
          this.init(a);
        }
        e.prototype.clickButton = function (a, d) {
          var k = this.chart,
            f = this.buttonOptions[a],
            g = k.xAxis[0],
            e = (k.scroller && k.scroller.getUnionExtremes()) || g || {},
            A = e.dataMin,
            h = e.dataMax,
            n = g && Math.round(Math.min(g.max, B(h, g.max))),
            m = f.type;
          e = f._range;
          var x,
            z = f.dataGrouping;
          if (null !== A && null !== h) {
            k.fixedRange = e;
            this.setSelected(a);
            z &&
              ((this.forcedDataGrouping = !0),
              b.prototype.setDataGrouping.call(
                g || { chart: this.chart },
                z,
                !1
              ),
              (this.frozenStates = f.preserveDataGrouping));
            if ("month" === m || "year" === m)
              if (g) {
                m = { range: f, max: n, chart: k, dataMin: A, dataMax: h };
                var p = g.minFromRange.call(m);
                w(m.newMax) && (n = m.newMax);
              } else e = f;
            else if (e) (p = Math.max(n - e, A)), (n = Math.min(p + e, h));
            else if ("ytd" === m)
              if (g)
                "undefined" === typeof h &&
                  ((A = Number.MAX_VALUE),
                  (h = Number.MIN_VALUE),
                  k.series.forEach(function (a) {
                    a = a.xData;
                    A = Math.min(a[0], A);
                    h = Math.max(a[a.length - 1], h);
                  }),
                  (d = !1)),
                  (n = this.getYTDExtremes(h, A, k.time.useUTC)),
                  (p = x = n.min),
                  (n = n.max);
              else {
                this.deferredYTDClick = a;
                return;
              }
            else
              "all" === m &&
                g &&
                (k.navigator &&
                  k.navigator.baseSeries[0] &&
                  (k.navigator.baseSeries[0].xAxis.options.range = void 0),
                (p = A),
                (n = h));
            c(p) && (p += f._offsetMin);
            c(n) && (n += f._offsetMax);
            this.dropdown && (this.dropdown.selectedIndex = a + 1);
            if (g)
              g.setExtremes(p, n, B(d, !0), void 0, {
                trigger: "rangeSelectorButton",
                rangeSelectorButton: f,
              });
            else {
              var l = y(k.options.xAxis)[0];
              var r = l.range;
              l.range = e;
              var u = l.min;
              l.min = x;
              q(k, "load", function () {
                l.range = r;
                l.min = u;
              });
            }
            C(this, "afterBtnClick");
          }
        };
        e.prototype.setSelected = function (a) {
          this.selected = this.options.selected = a;
        };
        e.prototype.init = function (a) {
          var b = this,
            c = a.options.rangeSelector,
            d = c.buttons || b.defaultButtons.slice(),
            k = c.selected,
            f = function () {
              var a = b.minInput,
                c = b.maxInput;
              a && a.blur && C(a, "blur");
              c && c.blur && C(c, "blur");
            };
          b.chart = a;
          b.options = c;
          b.buttons = [];
          b.buttonOptions = d;
          this.eventsToUnbind = [];
          this.eventsToUnbind.push(q(a.container, "mousedown", f));
          this.eventsToUnbind.push(q(a, "resize", f));
          d.forEach(b.computeButtonRange);
          "undefined" !== typeof k && d[k] && this.clickButton(k, !1);
          this.eventsToUnbind.push(
            q(a, "load", function () {
              a.xAxis &&
                a.xAxis[0] &&
                q(a.xAxis[0], "setExtremes", function (c) {
                  this.max - this.min !== a.fixedRange &&
                    "rangeSelectorButton" !== c.trigger &&
                    "updatedData" !== c.trigger &&
                    b.forcedDataGrouping &&
                    !b.frozenStates &&
                    this.setDataGrouping(!1, !1);
                });
            })
          );
        };
        e.prototype.updateButtonStates = function () {
          var a = this,
            b = this.chart,
            c = this.dropdown,
            d = b.xAxis[0],
            f = Math.round(d.max - d.min),
            g = !d.hasVisibleSeries,
            e = (b.scroller && b.scroller.getUnionExtremes()) || d,
            h = e.dataMin,
            n = e.dataMax;
          b = a.getYTDExtremes(n, h, b.time.useUTC);
          var m = b.min,
            y = b.max,
            q = a.selected,
            x = w(q),
            p = a.options.allButtonsEnabled,
            z = a.buttons;
          a.buttonOptions.forEach(function (b, k) {
            var e = b._range,
              A = b.type,
              G = b.count || 1,
              L = z[k],
              I = 0,
              l = b._offsetMax - b._offsetMin;
            b = k === q;
            var O = e > n - h,
              r = e < d.minRange,
              u = !1,
              t = !1;
            e = e === f;
            ("month" === A || "year" === A) &&
            f + 36e5 >= 864e5 * { month: 28, year: 365 }[A] * G - l &&
            f - 36e5 <= 864e5 * { month: 31, year: 366 }[A] * G + l
              ? (e = !0)
              : "ytd" === A
              ? ((e = y - m + l === f), (u = !b))
              : "all" === A &&
                ((e = d.max - d.min >= n - h), (t = !b && x && e));
            A = !p && (O || r || t || g);
            G = (b && e) || (e && !x && !u) || (b && a.frozenStates);
            A ? (I = 3) : G && ((x = !0), (I = 2));
            L.state !== I &&
              (L.setState(I),
              c &&
                ((c.options[k + 1].disabled = A),
                2 === I && (c.selectedIndex = k + 1)),
              0 === I && q === k && a.setSelected());
          });
        };
        e.prototype.computeButtonRange = function (a) {
          var b = a.type,
            c = a.count || 1,
            d = {
              millisecond: 1,
              second: 1e3,
              minute: 6e4,
              hour: 36e5,
              day: 864e5,
              week: 6048e5,
            };
          if (d[b]) a._range = d[b] * c;
          else if ("month" === b || "year" === b)
            a._range = 864e5 * { month: 30, year: 365 }[b] * c;
          a._offsetMin = B(a.offsetMin, 0);
          a._offsetMax = B(a.offsetMax, 0);
          a._range += a._offsetMax - a._offsetMin;
        };
        e.prototype.getInputValue = function (a) {
          a = "min" === a ? this.minInput : this.maxInput;
          var b = this.chart.options.rangeSelector,
            c = this.chart.time;
          return a
            ? (
                ("text" === a.type && b.inputDateParser) ||
                this.defaultInputDateParser
              )(a.value, c.useUTC, c)
            : 0;
        };
        e.prototype.setInputValue = function (a, b) {
          var d = this.options,
            k = this.chart.time,
            f = "min" === a ? this.minInput : this.maxInput;
          a = "min" === a ? this.minDateBox : this.maxDateBox;
          if (f) {
            var g = f.getAttribute("data-hc-time");
            g = c(g) ? Number(g) : void 0;
            c(b) &&
              (c(g) && f.setAttribute("data-hc-time-previous", g),
              f.setAttribute("data-hc-time", b),
              (g = b));
            f.value = k.dateFormat(
              this.inputTypeFormats[f.type] || d.inputEditDateFormat,
              g
            );
            a && a.attr({ text: k.dateFormat(d.inputDateFormat, g) });
          }
        };
        e.prototype.setInputExtremes = function (a, b, c) {
          if ((a = "min" === a ? this.minInput : this.maxInput)) {
            var d = this.inputTypeFormats[a.type],
              k = this.chart.time;
            d &&
              ((b = k.dateFormat(d, b)),
              a.min !== b && (a.min = b),
              (c = k.dateFormat(d, c)),
              a.max !== c && (a.max = c));
          }
        };
        e.prototype.showInput = function (b) {
          var c = "min" === b ? this.minDateBox : this.maxDateBox;
          if (
            (b = "min" === b ? this.minInput : this.maxInput) &&
            c &&
            this.inputGroup
          ) {
            var d = "text" === b.type,
              k = this.inputGroup,
              f = k.translateX;
            k = k.translateY;
            var g = this.options.inputBoxWidth;
            a(b, {
              width: d ? c.width + (g ? -2 : 20) + "px" : "auto",
              height: d ? c.height - 2 + "px" : "auto",
              border: "2px solid silver",
            });
            d && g
              ? a(b, { left: f + c.x + "px", top: k + "px" })
              : a(b, {
                  left:
                    Math.min(
                      Math.round(c.x + f - (b.offsetWidth - c.width) / 2),
                      this.chart.chartWidth - b.offsetWidth
                    ) + "px",
                  top: k - (b.offsetHeight - c.height) / 2 + "px",
                });
          }
        };
        e.prototype.hideInput = function (b) {
          (b = "min" === b ? this.minInput : this.maxInput) &&
            a(b, { top: "-9999em", border: 0, width: "1px", height: "1px" });
        };
        e.prototype.defaultInputDateParser = function (a, b, c) {
          var d = a.split("/").join("-").split(" ").join("T");
          -1 === d.indexOf("T") && (d += "T00:00");
          if (b) d += "Z";
          else {
            var k;
            if ((k = r.isSafari))
              (k = d),
                (k = !(
                  6 < k.length &&
                  (k.lastIndexOf("-") === k.length - 6 ||
                    k.lastIndexOf("+") === k.length - 6)
                ));
            k &&
              ((k = new Date(d).getTimezoneOffset() / 60),
              (d += 0 >= k ? "+" + F(-k) + ":00" : "-" + F(k) + ":00"));
          }
          d = Date.parse(d);
          w(d) ||
            ((a = a.split("-")), (d = Date.UTC(D(a[0]), D(a[1]) - 1, D(a[2]))));
          c && b && w(d) && (d += c.getTimezoneOffset(d));
          return d;
        };
        e.prototype.drawInput = function (b) {
          function c() {
            var a = e.getInputValue(b),
              c = d.xAxis[0],
              k = d.scroller && d.scroller.xAxis ? d.scroller.xAxis : c,
              f = k.dataMin;
            k = k.dataMax;
            var g = e.maxInput,
              h = e.minInput;
            a !== Number(l.getAttribute("data-hc-time-previous")) &&
              w(a) &&
              (l.setAttribute("data-hc-time-previous", a),
              p && g && w(f)
                ? a > Number(g.getAttribute("data-hc-time"))
                  ? (a = void 0)
                  : a < f && (a = f)
                : h &&
                  w(k) &&
                  (a < Number(h.getAttribute("data-hc-time"))
                    ? (a = void 0)
                    : a > k && (a = k)),
              "undefined" !== typeof a &&
                c.setExtremes(p ? a : c.min, p ? c.max : a, void 0, void 0, {
                  trigger: "rangeSelectorInput",
                }));
          }
          var d = this.chart,
            k = this.div,
            f = this.inputGroup,
            e = this,
            y = d.renderer.style || {},
            q = d.renderer,
            x = d.options.rangeSelector,
            p = "min" === b,
            z = h.lang[p ? "rangeSelectorFrom" : "rangeSelectorTo"];
          z = q
            .label(z, 0)
            .addClass("highcharts-range-label")
            .attr({ padding: z ? 2 : 0, height: z ? x.inputBoxHeight : 0 })
            .add(f);
          q = q
            .label("", 0)
            .addClass("highcharts-range-input")
            .attr({
              padding: 2,
              width: x.inputBoxWidth,
              height: x.inputBoxHeight,
              "text-align": "center",
            })
            .on("click", function () {
              e.showInput(b);
              e[b + "Input"].focus();
            });
          d.styledMode ||
            q.attr({ stroke: x.inputBoxBorderColor, "stroke-width": 1 });
          q.add(f);
          var l = g(
            "input",
            { name: b, className: "highcharts-range-selector" },
            void 0,
            k
          );
          l.setAttribute("type", m(x.inputDateFormat || "%b %e, %Y"));
          d.styledMode ||
            (z.css(v(y, x.labelStyle)),
            q.css(v({ color: u.neutralColor80 }, y, x.inputStyle)),
            a(
              l,
              n(
                {
                  position: "absolute",
                  border: 0,
                  boxShadow: "0 0 15px rgba(0,0,0,0.3)",
                  width: "1px",
                  height: "1px",
                  padding: 0,
                  textAlign: "center",
                  fontSize: y.fontSize,
                  fontFamily: y.fontFamily,
                  top: "-9999em",
                },
                x.inputStyle
              )
            ));
          l.onfocus = function () {
            e.showInput(b);
          };
          l.onblur = function () {
            l === r.doc.activeElement && c();
            e.hideInput(b);
            e.setInputValue(b);
            l.blur();
          };
          var t = !1;
          l.onchange = function () {
            t || (c(), e.hideInput(b), l.blur());
          };
          l.onkeypress = function (a) {
            13 === a.keyCode && c();
          };
          l.onkeydown = function (a) {
            t = !0;
            (38 !== a.keyCode && 40 !== a.keyCode) || c();
          };
          l.onkeyup = function () {
            t = !1;
          };
          return { dateBox: q, input: l, label: z };
        };
        e.prototype.getPosition = function () {
          var a = this.chart,
            b = a.options.rangeSelector;
          a = "top" === b.verticalAlign ? a.plotTop - a.axisOffset[0] : 0;
          return {
            buttonTop: a + b.buttonPosition.y,
            inputTop: a + b.inputPosition.y - 10,
          };
        };
        e.prototype.getYTDExtremes = function (a, b, c) {
          var d = this.chart.time,
            f = new d.Date(a),
            k = d.get("FullYear", f);
          c = c ? d.Date.UTC(k, 0, 1) : +new d.Date(k, 0, 1);
          b = Math.max(b, c);
          f = f.getTime();
          return { max: Math.min(a || f, f), min: b };
        };
        e.prototype.render = function (a, b) {
          var d = this.chart,
            f = d.renderer,
            k = d.container,
            e = d.options,
            h = e.rangeSelector,
            n = B(e.chart.style && e.chart.style.zIndex, 0) + 1;
          e = h.inputEnabled;
          if (!1 !== h.enabled) {
            this.rendered ||
              ((this.group = f
                .g("range-selector-group")
                .attr({ zIndex: 7 })
                .add()),
              (this.div = g("div", void 0, {
                position: "relative",
                height: 0,
                zIndex: n,
              })),
              this.buttonOptions.length && this.renderButtons(),
              k.parentNode && k.parentNode.insertBefore(this.div, k),
              e &&
                ((this.inputGroup = f.g("input-group").add(this.group)),
                (f = this.drawInput("min")),
                (this.minDateBox = f.dateBox),
                (this.minLabel = f.label),
                (this.minInput = f.input),
                (f = this.drawInput("max")),
                (this.maxDateBox = f.dateBox),
                (this.maxLabel = f.label),
                (this.maxInput = f.input)));
            if (
              e &&
              (this.setInputValue("min", a),
              this.setInputValue("max", b),
              (a =
                (d.scroller && d.scroller.getUnionExtremes()) ||
                d.xAxis[0] ||
                {}),
              c(a.dataMin) &&
                c(a.dataMax) &&
                ((d = d.xAxis[0].minRange || 0),
                this.setInputExtremes(
                  "min",
                  a.dataMin,
                  Math.min(a.dataMax, this.getInputValue("max")) - d
                ),
                this.setInputExtremes(
                  "max",
                  Math.max(a.dataMin, this.getInputValue("min")) + d,
                  a.dataMax
                )),
              this.inputGroup)
            ) {
              var y = 0;
              [
                this.minLabel,
                this.minDateBox,
                this.maxLabel,
                this.maxDateBox,
              ].forEach(function (a) {
                if (a) {
                  var b = a.getBBox().width;
                  b && (a.attr({ x: y }), (y += b + h.inputSpacing));
                }
              });
            }
            this.alignElements();
            this.rendered = !0;
          }
        };
        e.prototype.renderButtons = function () {
          var a = this,
            b = this.buttons,
            c = this.options,
            d = h.lang,
            f = this.chart.renderer,
            e = v(c.buttonTheme),
            n = e && e.states,
            y = e.width || 28;
          delete e.width;
          delete e.states;
          this.buttonGroup = f.g("range-selector-buttons").add(this.group);
          var m = (this.dropdown = g(
            "select",
            void 0,
            {
              position: "absolute",
              width: "1px",
              height: "1px",
              padding: 0,
              border: 0,
              top: "-9999em",
              cursor: "pointer",
              opacity: 0.0001,
            },
            this.div
          ));
          q(m, "touchstart", function () {
            m.style.fontSize = "16px";
          });
          [
            [r.isMS ? "mouseover" : "mouseenter"],
            [r.isMS ? "mouseout" : "mouseleave"],
            ["change", "click"],
          ].forEach(function (c) {
            var d = c[0],
              f = c[1];
            q(m, d, function () {
              var c = b[a.currentButtonIndex()];
              c && C(c.element, f || d);
            });
          });
          this.zoomText = f
            .label((d && d.rangeSelectorZoom) || "", 0)
            .attr({
              padding: c.buttonTheme.padding,
              height: c.buttonTheme.height,
              paddingLeft: 0,
              paddingRight: 0,
            })
            .add(this.buttonGroup);
          this.chart.styledMode ||
            (this.zoomText.css(c.labelStyle),
            (e["stroke-width"] = B(e["stroke-width"], 0)));
          g(
            "option",
            { textContent: this.zoomText.textStr, disabled: !0 },
            void 0,
            m
          );
          this.buttonOptions.forEach(function (c, d) {
            g("option", { textContent: c.title || c.text }, void 0, m);
            b[d] = f
              .button(
                c.text,
                0,
                0,
                function (b) {
                  var f = c.events && c.events.click,
                    k;
                  f && (k = f.call(c, b));
                  !1 !== k && a.clickButton(d);
                  a.isActive = !0;
                },
                e,
                n && n.hover,
                n && n.select,
                n && n.disabled
              )
              .attr({ "text-align": "center", width: y })
              .add(a.buttonGroup);
            c.title && b[d].attr("title", c.title);
          });
        };
        e.prototype.alignElements = function () {
          var a = this,
            b = this.buttonGroup,
            c = this.buttons,
            d = this.chart,
            f = this.group,
            e = this.inputGroup,
            g = this.options,
            h = this.zoomText,
            n = d.options,
            y =
              n.exporting &&
              !1 !== n.exporting.enabled &&
              n.navigation &&
              n.navigation.buttonOptions;
          n = g.buttonPosition;
          var m = g.inputPosition,
            q = g.verticalAlign,
            l = function (b, c) {
              return y &&
                a.titleCollision(d) &&
                "top" === q &&
                "right" === c.align &&
                c.y - b.getBBox().height - 12 <
                  (y.y || 0) + (y.height || 0) + d.spacing[0]
                ? -40
                : 0;
            },
            x = d.plotLeft;
          if (f && n && m) {
            var z = n.x - d.spacing[3];
            if (b) {
              this.positionButtons();
              if (!this.initialButtonGroupWidth) {
                var p = 0;
                h && (p += h.getBBox().width + 5);
                c.forEach(function (a, b) {
                  p += a.width;
                  b !== c.length - 1 && (p += g.buttonSpacing);
                });
                this.initialButtonGroupWidth = p;
              }
              x -= d.spacing[3];
              this.updateButtonStates();
              h = l(b, n);
              this.alignButtonGroup(h);
              f.placed = b.placed = d.hasLoaded;
            }
            b = 0;
            e &&
              ((b = l(e, m)),
              "left" === m.align
                ? (z = x)
                : "right" === m.align && (z = -Math.max(d.axisOffset[1], -b)),
              e.align(
                {
                  y: m.y,
                  width: e.getBBox().width,
                  align: m.align,
                  x: m.x + z - 2,
                },
                !0,
                d.spacingBox
              ),
              (e.placed = d.hasLoaded));
            this.handleCollision(b);
            f.align({ verticalAlign: q }, !0, d.spacingBox);
            e = f.alignAttr.translateY;
            b = f.getBBox().height + 20;
            l = 0;
            "bottom" === q &&
              ((l =
                (l = d.legend && d.legend.options) &&
                "bottom" === l.verticalAlign &&
                l.enabled &&
                !l.floating
                  ? d.legend.legendHeight + B(l.margin, 10)
                  : 0),
              (b = b + l - 20),
              (l =
                e -
                b -
                (g.floating ? 0 : g.y) -
                (d.titleOffset ? d.titleOffset[2] : 0) -
                10));
            if ("top" === q)
              g.floating && (l = 0),
                d.titleOffset && d.titleOffset[0] && (l = d.titleOffset[0]),
                (l += d.margin[0] - d.spacing[0] || 0);
            else if ("middle" === q)
              if (m.y === n.y) l = e;
              else if (m.y || n.y)
                l = 0 > m.y || 0 > n.y ? l - Math.min(m.y, n.y) : e - b;
            f.translate(g.x, g.y + Math.floor(l));
            n = this.minInput;
            m = this.maxInput;
            e = this.dropdown;
            g.inputEnabled &&
              n &&
              m &&
              ((n.style.marginTop = f.translateY + "px"),
              (m.style.marginTop = f.translateY + "px"));
            e && (e.style.marginTop = f.translateY + "px");
          }
        };
        e.prototype.alignButtonGroup = function (a, b) {
          var c = this.chart,
            d = this.buttonGroup,
            f = this.options.buttonPosition,
            k = c.plotLeft - c.spacing[3],
            e = f.x - c.spacing[3];
          "right" === f.align
            ? (e += a - k)
            : "center" === f.align && (e -= k / 2);
          d &&
            d.align(
              {
                y: f.y,
                width: B(b, this.initialButtonGroupWidth),
                align: f.align,
                x: e,
              },
              !0,
              c.spacingBox
            );
        };
        e.prototype.positionButtons = function () {
          var a = this.buttons,
            b = this.chart,
            c = this.options,
            d = this.zoomText,
            f = b.hasLoaded ? "animate" : "attr",
            e = c.buttonPosition,
            g = b.plotLeft,
            h = g;
          d &&
            "hidden" !== d.visibility &&
            (d[f]({ x: B(g + e.x, g) }), (h += e.x + d.getBBox().width + 5));
          this.buttonOptions.forEach(function (b, d) {
            if ("hidden" !== a[d].visibility)
              a[d][f]({ x: h }), (h += a[d].width + c.buttonSpacing);
            else a[d][f]({ x: g });
          });
        };
        e.prototype.handleCollision = function (a) {
          var b = this,
            c = this.chart,
            d = this.buttonGroup,
            f = this.inputGroup,
            k = this.options,
            e = k.buttonPosition,
            g = k.dropdown,
            h = k.inputPosition;
          k = function () {
            var a = 0;
            b.buttons.forEach(function (b) {
              b = b.getBBox();
              b.width > a && (a = b.width);
            });
            return a;
          };
          var n = function (b) {
              if (f && d) {
                var c =
                    f.alignAttr.translateX +
                    f.alignOptions.x -
                    a +
                    f.getBBox().x +
                    2,
                  k = f.alignOptions.width,
                  g = d.alignAttr.translateX + d.getBBox().x;
                return g + b > c && c + k > g && e.y < h.y + f.getBBox().height;
              }
              return !1;
            },
            m = function () {
              f &&
                d &&
                f.attr({
                  translateX:
                    f.alignAttr.translateX + (c.axisOffset[1] >= -a ? 0 : -a),
                  translateY: f.alignAttr.translateY + d.getBBox().height + 10,
                });
            };
          if (d) {
            if ("always" === g) {
              this.collapseButtons(a);
              n(k()) && m();
              return;
            }
            "never" === g && this.expandButtons();
          }
          f && d
            ? h.align === e.align || n(this.initialButtonGroupWidth + 20)
              ? "responsive" === g
                ? (this.collapseButtons(a), n(k()) && m())
                : m()
              : "responsive" === g && this.expandButtons()
            : d &&
              "responsive" === g &&
              (this.initialButtonGroupWidth > c.plotWidth
                ? this.collapseButtons(a)
                : this.expandButtons());
        };
        e.prototype.collapseButtons = function (a) {
          var b = this.buttons,
            c = this.buttonOptions,
            d = this.chart,
            f = this.dropdown,
            k = this.options,
            e = this.zoomText,
            g =
              (d.userOptions.rangeSelector &&
                d.userOptions.rangeSelector.buttonTheme) ||
              {},
            h = function (a) {
              return {
                text: a ? a + " \u25be" : "\u25be",
                width: "auto",
                paddingLeft: B(k.buttonTheme.paddingLeft, g.padding, 8),
                paddingRight: B(k.buttonTheme.paddingRight, g.padding, 8),
              };
            };
          e && e.hide();
          var n = !1;
          c.forEach(function (a, c) {
            c = b[c];
            2 !== c.state ? c.hide() : (c.show(), c.attr(h(a.text)), (n = !0));
          });
          n ||
            (f && (f.selectedIndex = 0),
            b[0].show(),
            b[0].attr(h(this.zoomText && this.zoomText.textStr)));
          c = k.buttonPosition.align;
          this.positionButtons();
          ("right" !== c && "center" !== c) ||
            this.alignButtonGroup(
              a,
              b[this.currentButtonIndex()].getBBox().width
            );
          this.showDropdown();
        };
        e.prototype.expandButtons = function () {
          var a = this.buttons,
            b = this.buttonOptions,
            c = this.options,
            d = this.zoomText;
          this.hideDropdown();
          d && d.show();
          b.forEach(function (b, d) {
            d = a[d];
            d.show();
            d.attr({
              text: b.text,
              width: c.buttonTheme.width || 28,
              paddingLeft: B(c.buttonTheme.paddingLeft, "unset"),
              paddingRight: B(c.buttonTheme.paddingRight, "unset"),
            });
            2 > d.state && d.setState(0);
          });
          this.positionButtons();
        };
        e.prototype.currentButtonIndex = function () {
          var a = this.dropdown;
          return a && 0 < a.selectedIndex ? a.selectedIndex - 1 : 0;
        };
        e.prototype.showDropdown = function () {
          var b = this.buttonGroup,
            c = this.buttons,
            d = this.chart,
            f = this.dropdown;
          if (b && f) {
            var e = b.translateX;
            b = b.translateY;
            c = c[this.currentButtonIndex()].getBBox();
            a(f, {
              left: d.plotLeft + e + "px",
              top: b + 0.5 + "px",
              width: c.width + "px",
              height: c.height + "px",
            });
            this.hasVisibleDropdown = !0;
          }
        };
        e.prototype.hideDropdown = function () {
          var b = this.dropdown;
          b &&
            (a(b, { top: "-9999em", width: "1px", height: "1px" }),
            (this.hasVisibleDropdown = !1));
        };
        e.prototype.getHeight = function () {
          var a = this.options,
            b = this.group,
            c = a.y,
            d = a.buttonPosition.y,
            f = a.inputPosition.y;
          if (a.height) return a.height;
          this.alignElements();
          a = b ? b.getBBox(!0).height + 13 + c : 0;
          b = Math.min(f, d);
          if ((0 > f && 0 > d) || (0 < f && 0 < d)) a += Math.abs(b);
          return a;
        };
        e.prototype.titleCollision = function (a) {
          return !(a.options.title.text || a.options.subtitle.text);
        };
        e.prototype.update = function (a) {
          var b = this.chart;
          v(!0, b.options.rangeSelector, a);
          this.destroy();
          this.init(b);
          this.render();
        };
        e.prototype.destroy = function () {
          var a = this,
            b = a.minInput,
            c = a.maxInput;
          a.eventsToUnbind &&
            (a.eventsToUnbind.forEach(function (a) {
              return a();
            }),
            (a.eventsToUnbind = void 0));
          d(a.buttons);
          b && (b.onfocus = b.onblur = b.onchange = null);
          c && (c.onfocus = c.onblur = c.onchange = null);
          H(
            a,
            function (b, c) {
              b &&
                "chart" !== c &&
                (b instanceof t
                  ? b.destroy()
                  : b instanceof window.HTMLElement && f(b));
              b !== e.prototype[c] && (a[c] = null);
            },
            this
          );
        };
        return e;
      })();
      x.prototype.defaultButtons = [
        { type: "month", count: 1, text: "1m", title: "View 1 month" },
        { type: "month", count: 3, text: "3m", title: "View 3 months" },
        { type: "month", count: 6, text: "6m", title: "View 6 months" },
        { type: "ytd", text: "YTD", title: "View year to date" },
        { type: "year", count: 1, text: "1y", title: "View 1 year" },
        { type: "all", text: "All", title: "View all" },
      ];
      x.prototype.inputTypeFormats = {
        "datetime-local": "%Y-%m-%dT%H:%M:%S",
        date: "%Y-%m-%d",
        time: "%H:%M:%S",
      };
      b.prototype.minFromRange = function () {
        var a = this.range,
          b = a.type,
          c = this.max,
          d = this.chart.time,
          f = function (a, c) {
            var f = "year" === b ? "FullYear" : "Month",
              e = new d.Date(a),
              g = d.get(f, e);
            d.set(f, e, g + c);
            g === d.get(f, e) && d.set("Date", e, 0);
            return e.getTime() - a;
          };
        if (w(a)) {
          var e = c - a;
          var g = a;
        } else
          (e = c + f(c, -a.count)),
            this.chart && (this.chart.fixedRange = c - e);
        var h = B(this.dataMin, Number.MIN_VALUE);
        w(e) || (e = h);
        e <= h &&
          ((e = h),
          "undefined" === typeof g && (g = f(e, a.count)),
          (this.newMax = Math.min(e + g, this.dataMax)));
        w(c) || (e = void 0);
        return e;
      };
      if (!r.RangeSelector) {
        var z = [],
          K = function (a) {
            function b() {
              d &&
                ((c = a.xAxis[0].getExtremes()),
                (f = a.legend),
                (g = d && d.options.verticalAlign),
                w(c.min) && d.render(c.min, c.max),
                f.display &&
                  "top" === g &&
                  g === f.options.verticalAlign &&
                  ((e = v(a.spacingBox)),
                  (e.y =
                    "vertical" === f.options.layout
                      ? a.plotTop
                      : e.y + d.getHeight()),
                  (f.group.placed = !1),
                  f.align(e)));
            }
            var c,
              d = a.rangeSelector,
              f,
              e,
              g;
            d &&
              (E(z, function (b) {
                return b[0] === a;
              }) ||
                z.push([
                  a,
                  [
                    q(a.xAxis[0], "afterSetExtremes", function (a) {
                      d && d.render(a.min, a.max);
                    }),
                    q(a, "redraw", b),
                  ],
                ]),
              b());
          };
        q(e, "afterGetContainer", function () {
          this.options.rangeSelector &&
            this.options.rangeSelector.enabled &&
            (this.rangeSelector = new x(this));
        });
        q(e, "beforeRender", function () {
          var a = this.axes,
            b = this.rangeSelector;
          b &&
            (w(b.deferredYTDClick) &&
              (b.clickButton(b.deferredYTDClick), delete b.deferredYTDClick),
            a.forEach(function (a) {
              a.updateNames();
              a.setScale();
            }),
            this.getAxisMargins(),
            b.render(),
            (a = b.options.verticalAlign),
            b.options.floating ||
              ("bottom" === a
                ? (this.extraBottomMargin = !0)
                : "middle" !== a && (this.extraTopMargin = !0)));
        });
        q(e, "update", function (a) {
          var b = a.options.rangeSelector;
          a = this.rangeSelector;
          var d = this.extraBottomMargin,
            f = this.extraTopMargin;
          b &&
            b.enabled &&
            !c(a) &&
            this.options.rangeSelector &&
            ((this.options.rangeSelector.enabled = !0),
            (this.rangeSelector = a = new x(this)));
          this.extraTopMargin = this.extraBottomMargin = !1;
          a &&
            (K(this),
            (b =
              (b && b.verticalAlign) || (a.options && a.options.verticalAlign)),
            a.options.floating ||
              ("bottom" === b
                ? (this.extraBottomMargin = !0)
                : "middle" !== b && (this.extraTopMargin = !0)),
            this.extraBottomMargin !== d || this.extraTopMargin !== f) &&
            (this.isDirtyBox = !0);
        });
        q(e, "render", function () {
          var a = this.rangeSelector;
          a &&
            !a.options.floating &&
            (a.render(),
            (a = a.options.verticalAlign),
            "bottom" === a
              ? (this.extraBottomMargin = !0)
              : "middle" !== a && (this.extraTopMargin = !0));
        });
        q(e, "getMargins", function () {
          var a = this.rangeSelector;
          a &&
            ((a = a.getHeight()),
            this.extraTopMargin && (this.plotTop += a),
            this.extraBottomMargin && (this.marginBottom += a));
        });
        e.prototype.callbacks.push(K);
        q(e, "destroy", function () {
          for (var a = 0; a < z.length; a++) {
            var b = z[a];
            if (b[0] === this) {
              b[1].forEach(function (a) {
                return a();
              });
              z.splice(a, 1);
              break;
            }
          }
        });
        r.RangeSelector = x;
      }
      return x;
    }
  );
  v(
    b,
    "Accessibility/Components/RangeSelectorComponent.js",
    [
      b["Accessibility/AccessibilityComponent.js"],
      b["Accessibility/Utils/ChartUtilities.js"],
      b["Accessibility/Utils/Announcer.js"],
      b["Core/Chart/Chart.js"],
      b["Accessibility/Utils/HTMLUtilities.js"],
      b["Accessibility/KeyboardNavigationHandler.js"],
      b["Core/Utilities.js"],
      b["Extensions/RangeSelector.js"],
    ],
    function (b, e, r, p, u, t, l, m) {
      var h = e.unhideChartElementFromAT,
        q = e.getAxisRangeDescription,
        g = u.setElAttrs,
        a = l.addEvent;
      e = l.extend;
      p.prototype.highlightRangeSelectorButton = function (a) {
        var b = (this.rangeSelector && this.rangeSelector.buttons) || [],
          c = this.highlightedRangeSelectorItemIx,
          e = this.rangeSelector && this.rangeSelector.selected;
        "undefined" !== typeof c &&
          b[c] &&
          c !== e &&
          b[c].setState(this.oldRangeSelectorItemState || 0);
        this.highlightedRangeSelectorItemIx = a;
        return b[a]
          ? (this.setFocusToElement(b[a].box, b[a].element),
            a !== e &&
              ((this.oldRangeSelectorItemState = b[a].state), b[a].setState(1)),
            !0)
          : !1;
      };
      a(m, "afterBtnClick", function () {
        if (
          this.chart.accessibility &&
          this.chart.accessibility.components.rangeSelector
        )
          return this.chart.accessibility.components.rangeSelector.onAfterBtnClick();
      });
      p = function () {};
      p.prototype = new b();
      e(p.prototype, {
        init: function () {
          this.announcer = new r(this.chart, "polite");
        },
        onChartUpdate: function () {
          var a = this.chart,
            b = this,
            f = a.rangeSelector;
          f &&
            (this.updateSelectorVisibility(),
            this.setDropdownAttrs(),
            f.buttons &&
              f.buttons.length &&
              f.buttons.forEach(function (a) {
                b.setRangeButtonAttrs(a);
              }),
            f.maxInput &&
              f.minInput &&
              ["minInput", "maxInput"].forEach(function (c, d) {
                if ((c = f[c]))
                  h(a, c),
                    b.setRangeInputAttrs(
                      c,
                      "accessibility.rangeSelector." +
                        (d ? "max" : "min") +
                        "InputLabel"
                    );
              }));
        },
        updateSelectorVisibility: function () {
          var a = this.chart,
            b = a.rangeSelector,
            f = b && b.dropdown,
            e = (b && b.buttons) || [];
          b && b.hasVisibleDropdown && f
            ? (h(a, f),
              e.forEach(function (a) {
                return a.element.setAttribute("aria-hidden", !0);
              }))
            : (f && f.setAttribute("aria-hidden", !0),
              e.forEach(function (b) {
                return h(a, b.element);
              }));
        },
        setDropdownAttrs: function () {
          var a = this.chart,
            b = a.rangeSelector && a.rangeSelector.dropdown;
          b &&
            ((a = a.langFormat("accessibility.rangeSelector.dropdownLabel", {
              rangeTitle: a.options.lang.rangeSelectorZoom,
            })),
            b.setAttribute("aria-label", a),
            b.setAttribute("tabindex", -1));
        },
        setRangeButtonAttrs: function (a) {
          g(a.element, { tabindex: -1, role: "button" });
        },
        setRangeInputAttrs: function (a, b) {
          var c = this.chart;
          g(a, { tabindex: -1, "aria-label": c.langFormat(b, { chart: c }) });
        },
        onButtonNavKbdArrowKey: function (a, b) {
          var c = a.response,
            d = this.keyCodes,
            e = this.chart,
            g = e.options.accessibility.keyboardNavigation.wrapAround;
          b = b === d.left || b === d.up ? -1 : 1;
          return e.highlightRangeSelectorButton(
            e.highlightedRangeSelectorItemIx + b
          )
            ? c.success
            : g
            ? (a.init(b), c.success)
            : c[0 < b ? "next" : "prev"];
        },
        onButtonNavKbdClick: function (a) {
          a = a.response;
          var b = this.chart;
          3 !== b.oldRangeSelectorItemState &&
            this.fakeClickEvent(
              b.rangeSelector.buttons[b.highlightedRangeSelectorItemIx].element
            );
          return a.success;
        },
        onAfterBtnClick: function () {
          var a = this.chart,
            b = q(a.xAxis[0]);
          (a = a.langFormat(
            "accessibility.rangeSelector.clickButtonAnnouncement",
            { chart: a, axisRangeDescription: b }
          )) && this.announcer.announce(a);
        },
        onInputKbdMove: function (a) {
          var b = this.chart,
            c = b.rangeSelector,
            e = (b.highlightedInputRangeIx =
              (b.highlightedInputRangeIx || 0) + a);
          1 < e || 0 > e
            ? b.accessibility &&
              (b.accessibility.keyboardNavigation.tabindexContainer.focus(),
              b.accessibility.keyboardNavigation[0 > a ? "prev" : "next"]())
            : c &&
              ((a = c[e ? "maxDateBox" : "minDateBox"]),
              (c = c[e ? "maxInput" : "minInput"]),
              a && c && b.setFocusToElement(a, c));
        },
        onInputNavInit: function (b) {
          var c = this,
            f = this,
            e = this.chart,
            g = 0 < b ? 0 : 1,
            h = e.rangeSelector,
            m = h && h[g ? "maxDateBox" : "minDateBox"];
          b = h && h.minInput;
          h = h && h.maxInput;
          e.highlightedInputRangeIx = g;
          if (m && b && h) {
            e.setFocusToElement(m, g ? h : b);
            this.removeInputKeydownHandler && this.removeInputKeydownHandler();
            e = function (a) {
              (a.which || a.keyCode) === c.keyCodes.tab &&
                (a.preventDefault(),
                a.stopPropagation(),
                f.onInputKbdMove(a.shiftKey ? -1 : 1));
            };
            var q = a(b, "keydown", e),
              l = a(h, "keydown", e);
            this.removeInputKeydownHandler = function () {
              q();
              l();
            };
          }
        },
        onInputNavTerminate: function () {
          var a = this.chart.rangeSelector || {};
          a.maxInput && a.hideInput("max");
          a.minInput && a.hideInput("min");
          this.removeInputKeydownHandler &&
            (this.removeInputKeydownHandler(),
            delete this.removeInputKeydownHandler);
        },
        initDropdownNav: function () {
          var b = this,
            d = this.chart,
            f = d.rangeSelector,
            e = f && f.dropdown;
          f &&
            e &&
            (d.setFocusToElement(f.buttonGroup, e),
            this.removeDropdownKeydownHandler &&
              this.removeDropdownKeydownHandler(),
            (this.removeDropdownKeydownHandler = a(e, "keydown", function (a) {
              (a.which || a.keyCode) === b.keyCodes.tab &&
                (a.preventDefault(),
                a.stopPropagation(),
                d.accessibility &&
                  (d.accessibility.keyboardNavigation.tabindexContainer.focus(),
                  d.accessibility.keyboardNavigation[
                    a.shiftKey ? "prev" : "next"
                  ]()));
            })));
        },
        getRangeSelectorButtonNavigation: function () {
          var a = this.chart,
            b = this.keyCodes,
            f = this;
          return new t(a, {
            keyCodeMap: [
              [
                [b.left, b.right, b.up, b.down],
                function (a) {
                  return f.onButtonNavKbdArrowKey(this, a);
                },
              ],
              [
                [b.enter, b.space],
                function () {
                  return f.onButtonNavKbdClick(this);
                },
              ],
            ],
            validate: function () {
              return !!(
                a.rangeSelector &&
                a.rangeSelector.buttons &&
                a.rangeSelector.buttons.length
              );
            },
            init: function (b) {
              var c = a.rangeSelector;
              c && c.hasVisibleDropdown
                ? f.initDropdownNav()
                : c &&
                  ((c = c.buttons.length - 1),
                  a.highlightRangeSelectorButton(0 < b ? 0 : c));
            },
            terminate: function () {
              f.removeDropdownKeydownHandler &&
                (f.removeDropdownKeydownHandler(),
                delete f.removeDropdownKeydownHandler);
            },
          });
        },
        getRangeSelectorInputNavigation: function () {
          var a = this.chart,
            b = this;
          return new t(a, {
            keyCodeMap: [],
            validate: function () {
              return !!(
                a.rangeSelector &&
                a.rangeSelector.inputGroup &&
                "hidden" !==
                  a.rangeSelector.inputGroup.element.getAttribute(
                    "visibility"
                  ) &&
                !1 !== a.options.rangeSelector.inputEnabled &&
                a.rangeSelector.minInput &&
                a.rangeSelector.maxInput
              );
            },
            init: function (a) {
              b.onInputNavInit(a);
            },
            terminate: function () {
              b.onInputNavTerminate();
            },
          });
        },
        getKeyboardNavigation: function () {
          return [
            this.getRangeSelectorButtonNavigation(),
            this.getRangeSelectorInputNavigation(),
          ];
        },
        destroy: function () {
          this.removeDropdownKeydownHandler &&
            this.removeDropdownKeydownHandler();
          this.removeInputKeydownHandler && this.removeInputKeydownHandler();
          this.announcer && this.announcer.destroy();
        },
      });
      return p;
    }
  );
  v(
    b,
    "Accessibility/Components/InfoRegionsComponent.js",
    [
      b["Core/Renderer/HTML/AST.js"],
      b["Core/Chart/Chart.js"],
      b["Core/FormatUtilities.js"],
      b["Core/Globals.js"],
      b["Core/Utilities.js"],
      b["Accessibility/AccessibilityComponent.js"],
      b["Accessibility/Utils/Announcer.js"],
      b["Accessibility/Components/AnnotationsA11y.js"],
      b["Accessibility/Utils/ChartUtilities.js"],
      b["Accessibility/Utils/HTMLUtilities.js"],
    ],
    function (b, e, r, p, u, t, l, m, h, q) {
      var g = r.format,
        a = p.doc;
      r = u.extend;
      var c = u.pick,
        d = m.getAnnotationsInfoHTML,
        f = h.getAxisDescription,
        n = h.getAxisRangeDescription,
        w = h.getChartTitle,
        v = h.unhideChartElementFromAT,
        N = q.addClass,
        J = q.getElement,
        H = q.getHeadingTagNameForElement,
        F = q.setElAttrs,
        B = q.stripHTMLTagsFromString,
        D = q.visuallyHideElement;
      e.prototype.getTypeDescription = function (a) {
        var b = a[0],
          c = (this.series && this.series[0]) || {};
        c = {
          numSeries: this.series.length,
          numPoints: c.points && c.points.length,
          chart: this,
          mapTitle: c.mapTitle,
        };
        if (!b)
          return this.langFormat("accessibility.chartTypes.emptyChart", c);
        if ("map" === b)
          return c.mapTitle
            ? this.langFormat("accessibility.chartTypes.mapTypeDescription", c)
            : this.langFormat("accessibility.chartTypes.unknownMap", c);
        if (1 < this.types.length)
          return this.langFormat(
            "accessibility.chartTypes.combinationChart",
            c
          );
        a = a[0];
        b = this.langFormat("accessibility.seriesTypeDescriptions." + a, c);
        var d = this.series && 2 > this.series.length ? "Single" : "Multiple";
        return (
          (this.langFormat("accessibility.chartTypes." + a + d, c) ||
            this.langFormat("accessibility.chartTypes.default" + d, c)) +
          (b ? " " + b : "")
        );
      };
      e = function () {};
      e.prototype = new t();
      r(e.prototype, {
        init: function () {
          var a = this.chart,
            b = this;
          this.initRegionsDefinitions();
          this.addEvent(a, "aftergetTableAST", function (a) {
            b.onDataTableCreated(a);
          });
          this.addEvent(a, "afterViewData", function (a) {
            b.dataTableDiv = a;
            setTimeout(function () {
              b.focusDataTable();
            }, 300);
          });
          this.announcer = new l(a, "assertive");
        },
        initRegionsDefinitions: function () {
          var a = this;
          this.screenReaderSections = {
            before: {
              element: null,
              buildContent: function (b) {
                var c =
                  b.options.accessibility.screenReaderSection
                    .beforeChartFormatter;
                return c ? c(b) : a.defaultBeforeChartFormatter(b);
              },
              insertIntoDOM: function (a, b) {
                b.renderTo.insertBefore(a, b.renderTo.firstChild);
              },
              afterInserted: function () {
                "undefined" !== typeof a.sonifyButtonId &&
                  a.initSonifyButton(a.sonifyButtonId);
                "undefined" !== typeof a.dataTableButtonId &&
                  a.initDataTableButton(a.dataTableButtonId);
              },
            },
            after: {
              element: null,
              buildContent: function (b) {
                var c =
                  b.options.accessibility.screenReaderSection
                    .afterChartFormatter;
                return c ? c(b) : a.defaultAfterChartFormatter();
              },
              insertIntoDOM: function (a, b) {
                b.renderTo.insertBefore(a, b.container.nextSibling);
              },
            },
          };
        },
        onChartRender: function () {
          var a = this;
          this.linkedDescriptionElement = this.getLinkedDescriptionElement();
          this.setLinkedDescriptionAttrs();
          Object.keys(this.screenReaderSections).forEach(function (b) {
            a.updateScreenReaderSection(b);
          });
        },
        getLinkedDescriptionElement: function () {
          var b = this.chart.options.accessibility.linkedDescription;
          if (b) {
            if ("string" !== typeof b) return b;
            b = g(b, this.chart);
            b = a.querySelectorAll(b);
            if (1 === b.length) return b[0];
          }
        },
        setLinkedDescriptionAttrs: function () {
          var a = this.linkedDescriptionElement;
          a &&
            (a.setAttribute("aria-hidden", "true"),
            N(a, "highcharts-linked-description"));
        },
        updateScreenReaderSection: function (a) {
          var c = this.chart,
            d = this.screenReaderSections[a],
            f = d.buildContent(c),
            e = (d.element = d.element || this.createElement("div")),
            g = e.firstChild || this.createElement("div");
          this.setScreenReaderSectionAttribs(e, a);
          b.setElementHTML(g, f);
          e.appendChild(g);
          d.insertIntoDOM(e, c);
          D(g);
          v(c, g);
          d.afterInserted && d.afterInserted();
        },
        setScreenReaderSectionAttribs: function (a, b) {
          var c = this.chart,
            d = c.langFormat(
              "accessibility.screenReaderSection." + b + "RegionLabel",
              { chart: c }
            );
          F(a, {
            id: "highcharts-screen-reader-region-" + b + "-" + c.index,
            "aria-label": d,
          });
          a.style.position = "relative";
          "all" === c.options.accessibility.landmarkVerbosity &&
            d &&
            a.setAttribute("role", "region");
        },
        defaultBeforeChartFormatter: function () {
          var a = this.chart,
            b = a.options.accessibility.screenReaderSection.beforeChartFormat,
            c = this.getAxesDescription(),
            f =
              a.sonify &&
              a.options.sonification &&
              a.options.sonification.enabled,
            e = "highcharts-a11y-sonify-data-btn-" + a.index,
            g = "hc-linkto-highcharts-data-table-" + a.index,
            h = d(a),
            m = a.langFormat(
              "accessibility.screenReaderSection.annotations.heading",
              { chart: a }
            );
          c = {
            headingTagName: H(a.renderTo),
            chartTitle: w(a),
            typeDescription: this.getTypeDescriptionText(),
            chartSubtitle: this.getSubtitleText(),
            chartLongdesc: this.getLongdescText(),
            xAxisDescription: c.xAxis,
            yAxisDescription: c.yAxis,
            playAsSoundButton: f ? this.getSonifyButtonText(e) : "",
            viewTableButton: a.getCSV ? this.getDataTableButtonText(g) : "",
            annotationsTitle: h ? m : "",
            annotationsList: h,
          };
          a = p.i18nFormat(b, c, a);
          this.dataTableButtonId = g;
          this.sonifyButtonId = e;
          return a.replace(/<(\w+)[^>]*?>\s*<\/\1>/g, "");
        },
        defaultAfterChartFormatter: function () {
          var a = this.chart,
            b = a.options.accessibility.screenReaderSection.afterChartFormat,
            c = { endOfChartMarker: this.getEndOfChartMarkerText() };
          return p.i18nFormat(b, c, a).replace(/<(\w+)[^>]*?>\s*<\/\1>/g, "");
        },
        getLinkedDescription: function () {
          var a = this.linkedDescriptionElement;
          return B((a && a.innerHTML) || "");
        },
        getLongdescText: function () {
          var a = this.chart.options,
            b = a.caption;
          b = b && b.text;
          var c = this.getLinkedDescription();
          return a.accessibility.description || c || b || "";
        },
        getTypeDescriptionText: function () {
          var a = this.chart;
          return a.types
            ? a.options.accessibility.typeDescription ||
                a.getTypeDescription(a.types)
            : "";
        },
        getDataTableButtonText: function (a) {
          var b = this.chart;
          b = b.langFormat("accessibility.table.viewAsDataTableButtonText", {
            chart: b,
            chartTitle: w(b),
          });
          return '<button id="' + a + '">' + b + "</button>";
        },
        getSonifyButtonText: function (a) {
          var b = this.chart;
          if (b.options.sonification && !1 === b.options.sonification.enabled)
            return "";
          b = b.langFormat("accessibility.sonification.playAsSoundButtonText", {
            chart: b,
            chartTitle: w(b),
          });
          return '<button id="' + a + '">' + b + "</button>";
        },
        getSubtitleText: function () {
          var a = this.chart.options.subtitle;
          return B((a && a.text) || "");
        },
        getEndOfChartMarkerText: function () {
          var a = this.chart,
            b = a.langFormat(
              "accessibility.screenReaderSection.endOfChartMarker",
              { chart: a }
            );
          return (
            '<div id="highcharts-end-of-chart-marker-' +
            a.index +
            '">' +
            b +
            "</div>"
          );
        },
        onDataTableCreated: function (a) {
          var b = this.chart;
          if (b.options.accessibility.enabled) {
            this.viewDataTableButton &&
              this.viewDataTableButton.setAttribute("aria-expanded", "true");
            var c = a.tree.attributes || {};
            c.tabindex = -1;
            c.summary = b.langFormat("accessibility.table.tableSummary", {
              chart: b,
            });
            a.tree.attributes = c;
          }
        },
        focusDataTable: function () {
          var a = this.dataTableDiv;
          (a = a && a.getElementsByTagName("table")[0]) && a.focus && a.focus();
        },
        initSonifyButton: function (a) {
          var b = this,
            c = (this.sonifyButton = J(a)),
            d = this.chart,
            f = function (a) {
              c &&
                (c.setAttribute("aria-hidden", "true"),
                c.setAttribute("aria-label", ""));
              a.preventDefault();
              a.stopPropagation();
              a = d.langFormat(
                "accessibility.sonification.playAsSoundClickAnnouncement",
                { chart: d }
              );
              b.announcer.announce(a);
              setTimeout(function () {
                c &&
                  (c.removeAttribute("aria-hidden"),
                  c.removeAttribute("aria-label"));
                d.sonify && d.sonify();
              }, 1e3);
            };
          c &&
            d &&
            (F(c, { tabindex: -1 }),
            (c.onclick = function (a) {
              (
                (d.options.accessibility &&
                  d.options.accessibility.screenReaderSection
                    .onPlayAsSoundClick) ||
                f
              ).call(this, a, d);
            }));
        },
        initDataTableButton: function (a) {
          var b = (this.viewDataTableButton = J(a)),
            c = this.chart;
          a = a.replace("hc-linkto-", "");
          b &&
            (F(b, { tabindex: -1, "aria-expanded": !!J(a) }),
            (b.onclick =
              c.options.accessibility.screenReaderSection
                .onViewDataTableClick ||
              function () {
                c.viewData();
              }));
        },
        getAxesDescription: function () {
          var a = this.chart,
            b = function (b, d) {
              b = a[b];
              return (
                1 < b.length ||
                (b[0] &&
                  c(
                    b[0].options.accessibility &&
                      b[0].options.accessibility.enabled,
                    d
                  ))
              );
            },
            d = !!a.types && 0 > a.types.indexOf("map"),
            f = !!a.hasCartesianSeries,
            e = b("xAxis", !a.angular && f && d);
          b = b("yAxis", f && d);
          d = {};
          e && (d.xAxis = this.getAxisDescriptionText("xAxis"));
          b && (d.yAxis = this.getAxisDescriptionText("yAxis"));
          return d;
        },
        getAxisDescriptionText: function (a) {
          var b = this.chart,
            c = b[a];
          return b.langFormat(
            "accessibility.axis." +
              a +
              "Description" +
              (1 < c.length ? "Plural" : "Singular"),
            {
              chart: b,
              names: c.map(function (a) {
                return f(a);
              }),
              ranges: c.map(function (a) {
                return n(a);
              }),
              numAxes: c.length,
            }
          );
        },
        destroy: function () {
          this.announcer && this.announcer.destroy();
        },
      });
      return e;
    }
  );
  v(
    b,
    "Accessibility/Components/ContainerComponent.js",
    [
      b["Accessibility/AccessibilityComponent.js"],
      b["Accessibility/KeyboardNavigationHandler.js"],
      b["Accessibility/Utils/ChartUtilities.js"],
      b["Core/Globals.js"],
      b["Accessibility/Utils/HTMLUtilities.js"],
      b["Core/Utilities.js"],
    ],
    function (b, e, r, p, u, t) {
      var l = r.unhideChartElementFromAT,
        m = r.getChartTitle,
        h = p.doc,
        q = u.stripHTMLTagsFromString;
      r = t.extend;
      p = function () {};
      p.prototype = new b();
      r(p.prototype, {
        onChartUpdate: function () {
          this.handleSVGTitleElement();
          this.setSVGContainerLabel();
          this.setGraphicContainerAttrs();
          this.setRenderToAttrs();
          this.makeCreditsAccessible();
        },
        handleSVGTitleElement: function () {
          var b = this.chart,
            a = "highcharts-title-" + b.index,
            c = q(
              b.langFormat("accessibility.svgContainerTitle", {
                chartTitle: m(b),
              })
            );
          if (c.length) {
            var d = (this.svgTitleElement =
              this.svgTitleElement ||
              h.createElementNS("http://www.w3.org/2000/svg", "title"));
            d.textContent = c;
            d.id = a;
            b.renderTo.insertBefore(d, b.renderTo.firstChild);
          }
        },
        setSVGContainerLabel: function () {
          var b = this.chart,
            a = b.langFormat("accessibility.svgContainerLabel", {
              chartTitle: m(b),
            });
          b.renderer.box &&
            a.length &&
            b.renderer.box.setAttribute("aria-label", a);
        },
        setGraphicContainerAttrs: function () {
          var b = this.chart,
            a = b.langFormat("accessibility.graphicContainerLabel", {
              chartTitle: m(b),
            });
          a.length && b.container.setAttribute("aria-label", a);
        },
        setRenderToAttrs: function () {
          var b = this.chart;
          "disabled" !== b.options.accessibility.landmarkVerbosity
            ? b.renderTo.setAttribute("role", "region")
            : b.renderTo.removeAttribute("role");
          b.renderTo.setAttribute(
            "aria-label",
            b.langFormat("accessibility.chartContainerLabel", {
              title: m(b),
              chart: b,
            })
          );
        },
        makeCreditsAccessible: function () {
          var b = this.chart,
            a = b.credits;
          a &&
            (a.textStr &&
              a.element.setAttribute(
                "aria-label",
                b.langFormat("accessibility.credits", {
                  creditsStr: q(a.textStr),
                })
              ),
            l(b, a.element));
        },
        getKeyboardNavigation: function () {
          var b = this.chart;
          return new e(b, {
            keyCodeMap: [],
            validate: function () {
              return !0;
            },
            init: function () {
              var a = b.accessibility;
              a && a.keyboardNavigation.tabindexContainer.focus();
            },
          });
        },
        destroy: function () {
          this.chart.renderTo.setAttribute("aria-hidden", !0);
        },
      });
      return p;
    }
  );
  v(
    b,
    "Accessibility/HighContrastMode.js",
    [b["Core/Globals.js"]],
    function (b) {
      var e = b.doc,
        r = b.isMS,
        p = b.win;
      return {
        isHighContrastModeActive: function () {
          var b = /(Edg)/.test(p.navigator.userAgent);
          if (p.matchMedia && b)
            return p.matchMedia("(-ms-high-contrast: active)").matches;
          if (r && p.getComputedStyle) {
            b = e.createElement("div");
            b.style.backgroundImage =
              "url(data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==)";
            e.body.appendChild(b);
            var t = (b.currentStyle || p.getComputedStyle(b)).backgroundImage;
            e.body.removeChild(b);
            return "none" === t;
          }
          return !1;
        },
        setHighContrastTheme: function (b) {
          b.highContrastModeActive = !0;
          var e = b.options.accessibility.highContrastTheme;
          b.update(e, !1);
          b.series.forEach(function (b) {
            var m = e.plotOptions[b.type] || {};
            b.update({
              color: m.color || "windowText",
              colors: [m.color || "windowText"],
              borderColor: m.borderColor || "window",
            });
            b.points.forEach(function (b) {
              b.options &&
                b.options.color &&
                b.update(
                  {
                    color: m.color || "windowText",
                    borderColor: m.borderColor || "window",
                  },
                  !1
                );
            });
          });
          b.redraw();
        },
      };
    }
  );
  v(b, "Accessibility/HighContrastTheme.js", [], function () {
    return {
      chart: { backgroundColor: "window" },
      title: { style: { color: "windowText" } },
      subtitle: { style: { color: "windowText" } },
      colorAxis: { minColor: "windowText", maxColor: "windowText", stops: [] },
      colors: ["windowText"],
      xAxis: {
        gridLineColor: "windowText",
        labels: { style: { color: "windowText" } },
        lineColor: "windowText",
        minorGridLineColor: "windowText",
        tickColor: "windowText",
        title: { style: { color: "windowText" } },
      },
      yAxis: {
        gridLineColor: "windowText",
        labels: { style: { color: "windowText" } },
        lineColor: "windowText",
        minorGridLineColor: "windowText",
        tickColor: "windowText",
        title: { style: { color: "windowText" } },
      },
      tooltip: {
        backgroundColor: "window",
        borderColor: "windowText",
        style: { color: "windowText" },
      },
      plotOptions: {
        series: {
          lineColor: "windowText",
          fillColor: "window",
          borderColor: "windowText",
          edgeColor: "windowText",
          borderWidth: 1,
          dataLabels: {
            connectorColor: "windowText",
            color: "windowText",
            style: { color: "windowText", textOutline: "none" },
          },
          marker: { lineColor: "windowText", fillColor: "windowText" },
        },
        pie: {
          color: "window",
          colors: ["window"],
          borderColor: "windowText",
          borderWidth: 1,
        },
        boxplot: { fillColor: "window" },
        candlestick: { lineColor: "windowText", fillColor: "window" },
        errorbar: { fillColor: "window" },
      },
      legend: {
        backgroundColor: "window",
        itemStyle: { color: "windowText" },
        itemHoverStyle: { color: "windowText" },
        itemHiddenStyle: { color: "#555" },
        title: { style: { color: "windowText" } },
      },
      credits: { style: { color: "windowText" } },
      labels: { style: { color: "windowText" } },
      drilldown: {
        activeAxisLabelStyle: { color: "windowText" },
        activeDataLabelStyle: { color: "windowText" },
      },
      navigation: {
        buttonOptions: {
          symbolStroke: "windowText",
          theme: { fill: "window" },
        },
      },
      rangeSelector: {
        buttonTheme: {
          fill: "window",
          stroke: "windowText",
          style: { color: "windowText" },
          states: {
            hover: {
              fill: "window",
              stroke: "windowText",
              style: { color: "windowText" },
            },
            select: {
              fill: "#444",
              stroke: "windowText",
              style: { color: "windowText" },
            },
          },
        },
        inputBoxBorderColor: "windowText",
        inputStyle: { backgroundColor: "window", color: "windowText" },
        labelStyle: { color: "windowText" },
      },
      navigator: {
        handles: { backgroundColor: "window", borderColor: "windowText" },
        outlineColor: "windowText",
        maskFill: "transparent",
        series: { color: "windowText", lineColor: "windowText" },
        xAxis: { gridLineColor: "windowText" },
      },
      scrollbar: {
        barBackgroundColor: "#444",
        barBorderColor: "windowText",
        buttonArrowColor: "windowText",
        buttonBackgroundColor: "window",
        buttonBorderColor: "windowText",
        rifleColor: "windowText",
        trackBackgroundColor: "window",
        trackBorderColor: "windowText",
      },
    };
  });
  v(
    b,
    "Accessibility/Options/Options.js",
    [b["Core/Color/Palette.js"]],
    function (b) {
      return {
        accessibility: {
          enabled: !0,
          screenReaderSection: {
            beforeChartFormat:
              "<{headingTagName}>{chartTitle}</{headingTagName}><div>{typeDescription}</div><div>{chartSubtitle}</div><div>{chartLongdesc}</div><div>{playAsSoundButton}</div><div>{viewTableButton}</div><div>{xAxisDescription}</div><div>{yAxisDescription}</div><div>{annotationsTitle}{annotationsList}</div>",
            afterChartFormat: "{endOfChartMarker}",
            axisRangeDateFormat: "%Y-%m-%d %H:%M:%S",
          },
          series: {
            describeSingleSeries: !1,
            pointDescriptionEnabledThreshold: 200,
          },
          point: {
            valueDescriptionFormat:
              "{index}. {xDescription}{separator}{value}.",
          },
          landmarkVerbosity: "all",
          linkedDescription:
            '*[data-highcharts-chart="{index}"] + .highcharts-description',
          keyboardNavigation: {
            enabled: !0,
            focusBorder: {
              enabled: !0,
              hideBrowserFocusOutline: !0,
              style: {
                color: b.highlightColor80,
                lineWidth: 2,
                borderRadius: 3,
              },
              margin: 2,
            },
            order: ["series", "zoom", "rangeSelector", "legend", "chartMenu"],
            wrapAround: !0,
            seriesNavigation: {
              skipNullPoints: !0,
              pointNavigationEnabledThreshold: !1,
            },
          },
          announceNewData: {
            enabled: !1,
            minAnnounceInterval: 5e3,
            interruptUser: !1,
          },
        },
        legend: {
          accessibility: { enabled: !0, keyboardNavigation: { enabled: !0 } },
        },
        exporting: { accessibility: { enabled: !0 } },
      };
    }
  );
  v(b, "Accessibility/Options/LangOptions.js", [], function () {
    return {
      accessibility: {
        defaultChartTitle: "Chart",
        chartContainerLabel: "{title}. Highcharts interactive chart.",
        svgContainerLabel: "Interactive chart",
        drillUpButton: "{buttonText}",
        credits: "Chart credits: {creditsStr}",
        thousandsSep: ",",
        svgContainerTitle: "",
        graphicContainerLabel: "",
        screenReaderSection: {
          beforeRegionLabel: "Chart screen reader information.",
          afterRegionLabel: "",
          annotations: {
            heading: "Chart annotations summary",
            descriptionSinglePoint:
              "{annotationText}. Related to {annotationPoint}",
            descriptionMultiplePoints:
              "{annotationText}. Related to {annotationPoint}{ Also related to, #each(additionalAnnotationPoints)}",
            descriptionNoPoints: "{annotationText}",
          },
          endOfChartMarker: "End of interactive chart.",
        },
        sonification: {
          playAsSoundButtonText: "Play as sound, {chartTitle}",
          playAsSoundClickAnnouncement: "Play",
        },
        legend: {
          legendLabelNoTitle: "Toggle series visibility",
          legendLabel: "Chart legend: {legendTitle}",
          legendItem: "Show {itemName}",
        },
        zoom: {
          mapZoomIn: "Zoom chart",
          mapZoomOut: "Zoom out chart",
          resetZoomButton: "Reset zoom",
        },
        rangeSelector: {
          dropdownLabel: "{rangeTitle}",
          minInputLabel: "Select start date.",
          maxInputLabel: "Select end date.",
          clickButtonAnnouncement: "Viewing {axisRangeDescription}",
        },
        table: {
          viewAsDataTableButtonText: "View as data table, {chartTitle}",
          tableSummary: "Table representation of chart.",
        },
        announceNewData: {
          newDataAnnounce: "Updated data for chart {chartTitle}",
          newSeriesAnnounceSingle: "New data series: {seriesDesc}",
          newPointAnnounceSingle: "New data point: {pointDesc}",
          newSeriesAnnounceMultiple:
            "New data series in chart {chartTitle}: {seriesDesc}",
          newPointAnnounceMultiple:
            "New data point in chart {chartTitle}: {pointDesc}",
        },
        seriesTypeDescriptions: {
          boxplot:
            "Box plot charts are typically used to display groups of statistical data. Each data point in the chart can have up to 5 values: minimum, lower quartile, median, upper quartile, and maximum.",
          arearange:
            "Arearange charts are line charts displaying a range between a lower and higher value for each point.",
          areasplinerange:
            "These charts are line charts displaying a range between a lower and higher value for each point.",
          bubble:
            "Bubble charts are scatter charts where each data point also has a size value.",
          columnrange:
            "Columnrange charts are column charts displaying a range between a lower and higher value for each point.",
          errorbar:
            "Errorbar series are used to display the variability of the data.",
          funnel:
            "Funnel charts are used to display reduction of data in stages.",
          pyramid:
            "Pyramid charts consist of a single pyramid with item heights corresponding to each point value.",
          waterfall:
            "A waterfall chart is a column chart where each column contributes towards a total end value.",
        },
        chartTypes: {
          emptyChart: "Empty chart",
          mapTypeDescription: "Map of {mapTitle} with {numSeries} data series.",
          unknownMap: "Map of unspecified region with {numSeries} data series.",
          combinationChart: "Combination chart with {numSeries} data series.",
          defaultSingle:
            "Chart with {numPoints} data {#plural(numPoints, points, point)}.",
          defaultMultiple: "Chart with {numSeries} data series.",
          splineSingle:
            "Line chart with {numPoints} data {#plural(numPoints, points, point)}.",
          splineMultiple: "Line chart with {numSeries} lines.",
          lineSingle:
            "Line chart with {numPoints} data {#plural(numPoints, points, point)}.",
          lineMultiple: "Line chart with {numSeries} lines.",
          columnSingle:
            "Bar chart with {numPoints} {#plural(numPoints, bars, bar)}.",
          columnMultiple: "Bar chart with {numSeries} data series.",
          barSingle:
            "Bar chart with {numPoints} {#plural(numPoints, bars, bar)}.",
          barMultiple: "Bar chart with {numSeries} data series.",
          pieSingle:
            "Pie chart with {numPoints} {#plural(numPoints, slices, slice)}.",
          pieMultiple: "Pie chart with {numSeries} pies.",
          scatterSingle:
            "Scatter chart with {numPoints} {#plural(numPoints, points, point)}.",
          scatterMultiple: "Scatter chart with {numSeries} data series.",
          boxplotSingle:
            "Boxplot with {numPoints} {#plural(numPoints, boxes, box)}.",
          boxplotMultiple: "Boxplot with {numSeries} data series.",
          bubbleSingle:
            "Bubble chart with {numPoints} {#plural(numPoints, bubbles, bubble)}.",
          bubbleMultiple: "Bubble chart with {numSeries} data series.",
        },
        axis: {
          xAxisDescriptionSingular:
            "The chart has 1 X axis displaying {names[0]}. {ranges[0]}",
          xAxisDescriptionPlural:
            "The chart has {numAxes} X axes displaying {#each(names, -1) }and {names[-1]}.",
          yAxisDescriptionSingular:
            "The chart has 1 Y axis displaying {names[0]}. {ranges[0]}",
          yAxisDescriptionPlural:
            "The chart has {numAxes} Y axes displaying {#each(names, -1) }and {names[-1]}.",
          timeRangeDays: "Range: {range} days.",
          timeRangeHours: "Range: {range} hours.",
          timeRangeMinutes: "Range: {range} minutes.",
          timeRangeSeconds: "Range: {range} seconds.",
          rangeFromTo: "Range: {rangeFrom} to {rangeTo}.",
          rangeCategories: "Range: {numCategories} categories.",
        },
        exporting: {
          chartMenuLabel: "Chart menu",
          menuButtonLabel: "View chart menu",
          exportRegionLabel: "Chart menu",
        },
        series: {
          summary: {
            default:
              "{name}, series {ix} of {numSeries} with {numPoints} data {#plural(numPoints, points, point)}.",
            defaultCombination:
              "{name}, series {ix} of {numSeries} with {numPoints} data {#plural(numPoints, points, point)}.",
            line: "{name}, line {ix} of {numSeries} with {numPoints} data {#plural(numPoints, points, point)}.",
            lineCombination:
              "{name}, series {ix} of {numSeries}. Line with {numPoints} data {#plural(numPoints, points, point)}.",
            spline:
              "{name}, line {ix} of {numSeries} with {numPoints} data {#plural(numPoints, points, point)}.",
            splineCombination:
              "{name}, series {ix} of {numSeries}. Line with {numPoints} data {#plural(numPoints, points, point)}.",
            column:
              "{name}, bar series {ix} of {numSeries} with {numPoints} {#plural(numPoints, bars, bar)}.",
            columnCombination:
              "{name}, series {ix} of {numSeries}. Bar series with {numPoints} {#plural(numPoints, bars, bar)}.",
            bar: "{name}, bar series {ix} of {numSeries} with {numPoints} {#plural(numPoints, bars, bar)}.",
            barCombination:
              "{name}, series {ix} of {numSeries}. Bar series with {numPoints} {#plural(numPoints, bars, bar)}.",
            pie: "{name}, pie {ix} of {numSeries} with {numPoints} {#plural(numPoints, slices, slice)}.",
            pieCombination:
              "{name}, series {ix} of {numSeries}. Pie with {numPoints} {#plural(numPoints, slices, slice)}.",
            scatter:
              "{name}, scatter plot {ix} of {numSeries} with {numPoints} {#plural(numPoints, points, point)}.",
            scatterCombination:
              "{name}, series {ix} of {numSeries}, scatter plot with {numPoints} {#plural(numPoints, points, point)}.",
            boxplot:
              "{name}, boxplot {ix} of {numSeries} with {numPoints} {#plural(numPoints, boxes, box)}.",
            boxplotCombination:
              "{name}, series {ix} of {numSeries}. Boxplot with {numPoints} {#plural(numPoints, boxes, box)}.",
            bubble:
              "{name}, bubble series {ix} of {numSeries} with {numPoints} {#plural(numPoints, bubbles, bubble)}.",
            bubbleCombination:
              "{name}, series {ix} of {numSeries}. Bubble series with {numPoints} {#plural(numPoints, bubbles, bubble)}.",
            map: "{name}, map {ix} of {numSeries} with {numPoints} {#plural(numPoints, areas, area)}.",
            mapCombination:
              "{name}, series {ix} of {numSeries}. Map with {numPoints} {#plural(numPoints, areas, area)}.",
            mapline:
              "{name}, line {ix} of {numSeries} with {numPoints} data {#plural(numPoints, points, point)}.",
            maplineCombination:
              "{name}, series {ix} of {numSeries}. Line with {numPoints} data {#plural(numPoints, points, point)}.",
            mapbubble:
              "{name}, bubble series {ix} of {numSeries} with {numPoints} {#plural(numPoints, bubbles, bubble)}.",
            mapbubbleCombination:
              "{name}, series {ix} of {numSeries}. Bubble series with {numPoints} {#plural(numPoints, bubbles, bubble)}.",
          },
          description: "{description}",
          xAxisDescription: "X axis, {name}",
          yAxisDescription: "Y axis, {name}",
          nullPointValue: "No value",
          pointAnnotationsDescription: "{Annotation: #each(annotations). }",
        },
      },
    };
  });
  v(
    b,
    "Accessibility/Options/DeprecatedOptions.js",
    [b["Core/Utilities.js"]],
    function (b) {
      function e(b, e, g) {
        for (var a, c = 0; c < e.length - 1; ++c)
          (a = e[c]), (b = b[a] = m(b[a], {}));
        b[e[e.length - 1]] = g;
      }
      function r(b, m, g, a) {
        function c(a, b) {
          return b.reduce(function (a, b) {
            return a[b];
          }, a);
        }
        var d = c(b.options, m),
          f = c(b.options, g);
        Object.keys(a).forEach(function (c) {
          var h,
            n = d[c];
          "undefined" !== typeof n &&
            (e(f, a[c], n),
            l(
              32,
              !1,
              b,
              ((h = {}),
              (h[m.join(".") + "." + c] = g.join(".") + "." + a[c].join(".")),
              h)
            ));
        });
      }
      function p(b) {
        var e = b.options.chart,
          g = b.options.accessibility || {};
        ["description", "typeDescription"].forEach(function (a) {
          var c;
          e[a] &&
            ((g[a] = e[a]),
            l(
              32,
              !1,
              b,
              ((c = {}), (c["chart." + a] = "use accessibility." + a), c)
            ));
        });
      }
      function u(b) {
        b.axes.forEach(function (e) {
          (e = e.options) &&
            e.description &&
            ((e.accessibility = e.accessibility || {}),
            (e.accessibility.description = e.description),
            l(32, !1, b, {
              "axis.description": "use axis.accessibility.description",
            }));
        });
      }
      function t(b) {
        var h = {
          description: ["accessibility", "description"],
          exposeElementToA11y: ["accessibility", "exposeAsGroupOnly"],
          pointDescriptionFormatter: [
            "accessibility",
            "pointDescriptionFormatter",
          ],
          skipKeyboardNavigation: [
            "accessibility",
            "keyboardNavigation",
            "enabled",
          ],
        };
        b.series.forEach(function (g) {
          Object.keys(h).forEach(function (a) {
            var c,
              d = g.options[a];
            "undefined" !== typeof d &&
              (e(g.options, h[a], "skipKeyboardNavigation" === a ? !d : d),
              l(
                32,
                !1,
                b,
                ((c = {}), (c["series." + a] = "series." + h[a].join(".")), c)
              ));
          });
        });
      }
      var l = b.error,
        m = b.pick;
      return function (b) {
        p(b);
        u(b);
        b.series && t(b);
        r(b, ["accessibility"], ["accessibility"], {
          pointDateFormat: ["point", "dateFormat"],
          pointDateFormatter: ["point", "dateFormatter"],
          pointDescriptionFormatter: ["point", "descriptionFormatter"],
          pointDescriptionThreshold: [
            "series",
            "pointDescriptionEnabledThreshold",
          ],
          pointNavigationThreshold: [
            "keyboardNavigation",
            "seriesNavigation",
            "pointNavigationEnabledThreshold",
          ],
          pointValueDecimals: ["point", "valueDecimals"],
          pointValuePrefix: ["point", "valuePrefix"],
          pointValueSuffix: ["point", "valueSuffix"],
          screenReaderSectionFormatter: [
            "screenReaderSection",
            "beforeChartFormatter",
          ],
          describeSingleSeries: ["series", "describeSingleSeries"],
          seriesDescriptionFormatter: ["series", "descriptionFormatter"],
          onTableAnchorClick: ["screenReaderSection", "onViewDataTableClick"],
          axisRangeDateFormat: ["screenReaderSection", "axisRangeDateFormat"],
        });
        r(
          b,
          ["accessibility", "keyboardNavigation"],
          ["accessibility", "keyboardNavigation", "seriesNavigation"],
          { skipNullPoints: ["skipNullPoints"], mode: ["mode"] }
        );
        r(b, ["lang", "accessibility"], ["lang", "accessibility"], {
          legendItem: ["legend", "legendItem"],
          legendLabel: ["legend", "legendLabel"],
          mapZoomIn: ["zoom", "mapZoomIn"],
          mapZoomOut: ["zoom", "mapZoomOut"],
          resetZoomButton: ["zoom", "resetZoomButton"],
          screenReaderRegionLabel: ["screenReaderSection", "beforeRegionLabel"],
          rangeSelectorButton: ["rangeSelector", "buttonText"],
          rangeSelectorMaxInput: ["rangeSelector", "maxInputLabel"],
          rangeSelectorMinInput: ["rangeSelector", "minInputLabel"],
          svgContainerEnd: ["screenReaderSection", "endOfChartMarker"],
          viewAsDataTable: ["table", "viewAsDataTableButtonText"],
          tableSummary: ["table", "tableSummary"],
        });
      };
    }
  );
  v(
    b,
    "Accessibility/A11yI18n.js",
    [
      b["Core/Chart/Chart.js"],
      b["Core/Globals.js"],
      b["Core/FormatUtilities.js"],
      b["Core/Utilities.js"],
    ],
    function (b, e, r, p) {
      function u(b, e) {
        var h = b.indexOf("#each("),
          g = b.indexOf("#plural("),
          a = b.indexOf("["),
          c = b.indexOf("]");
        if (-1 < h) {
          c = b.slice(h).indexOf(")") + h;
          g = b.substring(0, h);
          a = b.substring(c + 1);
          c = b.substring(h + 6, c).split(",");
          h = Number(c[1]);
          b = "";
          if ((e = e[c[0]]))
            for (
              h = isNaN(h) ? e.length : h,
                h = 0 > h ? e.length + h : Math.min(h, e.length),
                c = 0;
              c < h;
              ++c
            )
              b += g + e[c] + a;
          return b.length ? b : "";
        }
        if (-1 < g) {
          a = b.slice(g).indexOf(")") + g;
          g = b.substring(g + 8, a).split(",");
          switch (Number(e[g[0]])) {
            case 0:
              b = l(g[4], g[1]);
              break;
            case 1:
              b = l(g[2], g[1]);
              break;
            case 2:
              b = l(g[3], g[1]);
              break;
            default:
              b = g[1];
          }
          b
            ? ((e = b),
              (e = (e.trim && e.trim()) || e.replace(/^\s+|\s+$/g, "")))
            : (e = "");
          return e;
        }
        return -1 < a
          ? ((g = b.substring(0, a)),
            (a = Number(b.substring(a + 1, c))),
            (b = void 0),
            (e = e[g]),
            !isNaN(a) &&
              e &&
              (0 > a
                ? ((b = e[e.length + a]),
                  "undefined" === typeof b && (b = e[0]))
                : ((b = e[a]),
                  "undefined" === typeof b && (b = e[e.length - 1]))),
            "undefined" !== typeof b ? b : "")
          : "{" + b + "}";
      }
      var t = r.format,
        l = p.pick;
      e.i18nFormat = function (b, e, l) {
        var g = function (a, b) {
            a = a.slice(b || 0);
            var c = a.indexOf("{"),
              d = a.indexOf("}");
            if (-1 < c && d > c)
              return {
                statement: a.substring(c + 1, d),
                begin: b + c + 1,
                end: b + d,
              };
          },
          a = [],
          c = 0;
        do {
          var d = g(b, c);
          var f = b.substring(c, d && d.begin - 1);
          f.length && a.push({ value: f, type: "constant" });
          d && a.push({ value: d.statement, type: "statement" });
          c = d ? d.end + 1 : c + 1;
        } while (d);
        a.forEach(function (a) {
          "statement" === a.type && (a.value = u(a.value, e));
        });
        return t(
          a.reduce(function (a, b) {
            return a + b.value;
          }, ""),
          e,
          l
        );
      };
      b.prototype.langFormat = function (b, h) {
        b = b.split(".");
        for (var l = this.options.lang, g = 0; g < b.length; ++g)
          l = l && l[b[g]];
        return "string" === typeof l ? e.i18nFormat(l, h, this) : "";
      };
    }
  );
  v(
    b,
    "Accessibility/FocusBorder.js",
    [
      b["Core/Chart/Chart.js"],
      b["Core/Globals.js"],
      b["Core/Renderer/SVG/SVGElement.js"],
      b["Core/Renderer/SVG/SVGLabel.js"],
      b["Core/Utilities.js"],
    ],
    function (b, e, r, p, u) {
      function t(a) {
        if (!a.focusBorderDestroyHook) {
          var b = a.destroy;
          a.destroy = function () {
            a.focusBorder && a.focusBorder.destroy && a.focusBorder.destroy();
            return b.apply(a, arguments);
          };
          a.focusBorderDestroyHook = b;
        }
      }
      function l(b) {
        for (var c = [], e = 1; e < arguments.length; e++)
          c[e - 1] = arguments[e];
        b.focusBorderUpdateHooks ||
          ((b.focusBorderUpdateHooks = {}),
          a.forEach(function (a) {
            a += "Setter";
            var d = b[a] || b._defaultSetter;
            b.focusBorderUpdateHooks[a] = d;
            b[a] = function () {
              var a = d.apply(b, arguments);
              b.addFocusBorder.apply(b, c);
              return a;
            };
          }));
      }
      function m(a) {
        a.focusBorderUpdateHooks &&
          (Object.keys(a.focusBorderUpdateHooks).forEach(function (b) {
            var c = a.focusBorderUpdateHooks[b];
            c === a._defaultSetter ? delete a[b] : (a[b] = c);
          }),
          delete a.focusBorderUpdateHooks);
      }
      var h = u.addEvent,
        q = u.extend,
        g = u.pick,
        a = "x y transform width height r d stroke-width".split(" ");
      q(r.prototype, {
        addFocusBorder: function (a, b) {
          this.focusBorder && this.removeFocusBorder();
          var c = this.getBBox(),
            d = g(a, 3);
          c.x += this.translateX ? this.translateX : 0;
          c.y += this.translateY ? this.translateY : 0;
          var h = c.x - d,
            m = c.y - d,
            q = c.width + 2 * d,
            r = c.height + 2 * d,
            u = this instanceof p;
          if ("text" === this.element.nodeName || u) {
            var v = !!this.rotation;
            if (u) var w = { x: v ? 1 : 0, y: 0 };
            else {
              var D = (w = 0);
              "middle" === this.attr("text-anchor")
                ? ((w = e.isFirefox && this.rotation ? 0.25 : 0.5),
                  (D = e.isFirefox && !this.rotation ? 0.75 : 0.5))
                : this.rotation
                ? (w = 0.25)
                : (D = 0.75);
              w = { x: w, y: D };
            }
            D = +this.attr("x");
            var y = +this.attr("y");
            isNaN(D) || (h = D - c.width * w.x - d);
            isNaN(y) || (m = y - c.height * w.y - d);
            u &&
              v &&
              ((u = q),
              (q = r),
              (r = u),
              isNaN(D) || (h = D - c.height * w.x - d),
              isNaN(y) || (m = y - c.width * w.y - d));
          }
          this.focusBorder = this.renderer
            .rect(h, m, q, r, parseInt(((b && b.r) || 0).toString(), 10))
            .addClass("highcharts-focus-border")
            .attr({ zIndex: 99 })
            .add(this.parentGroup);
          this.renderer.styledMode ||
            this.focusBorder.attr({
              stroke: b && b.stroke,
              "stroke-width": b && b.strokeWidth,
            });
          l(this, a, b);
          t(this);
        },
        removeFocusBorder: function () {
          m(this);
          this.focusBorderDestroyHook &&
            ((this.destroy = this.focusBorderDestroyHook),
            delete this.focusBorderDestroyHook);
          this.focusBorder &&
            (this.focusBorder.destroy(), delete this.focusBorder);
        },
      });
      b.prototype.renderFocusBorder = function () {
        var a = this.focusElement,
          b = this.options.accessibility.keyboardNavigation.focusBorder;
        a &&
          (a.removeFocusBorder(),
          b.enabled &&
            a.addFocusBorder(b.margin, {
              stroke: b.style.color,
              strokeWidth: b.style.lineWidth,
              r: b.style.borderRadius,
            }));
      };
      b.prototype.setFocusToElement = function (a, b) {
        var c = this.options.accessibility.keyboardNavigation.focusBorder;
        (b = b || a.element) &&
          b.focus &&
          ((b.hcEvents && b.hcEvents.focusin) ||
            h(b, "focusin", function () {}),
          b.focus(),
          c.hideBrowserFocusOutline && (b.style.outline = "none"));
        this.focusElement && this.focusElement.removeFocusBorder();
        this.focusElement = a;
        this.renderFocusBorder();
      };
    }
  );
  v(
    b,
    "Accessibility/Accessibility.js",
    [
      b["Core/Chart/Chart.js"],
      b["Accessibility/Utils/ChartUtilities.js"],
      b["Core/Globals.js"],
      b["Accessibility/KeyboardNavigationHandler.js"],
      b["Core/DefaultOptions.js"],
      b["Core/Series/Point.js"],
      b["Core/Series/Series.js"],
      b["Core/Utilities.js"],
      b["Accessibility/AccessibilityComponent.js"],
      b["Accessibility/KeyboardNavigation.js"],
      b["Accessibility/Components/LegendComponent.js"],
      b["Accessibility/Components/MenuComponent.js"],
      b["Accessibility/Components/SeriesComponent/SeriesComponent.js"],
      b["Accessibility/Components/ZoomComponent.js"],
      b["Accessibility/Components/RangeSelectorComponent.js"],
      b["Accessibility/Components/InfoRegionsComponent.js"],
      b["Accessibility/Components/ContainerComponent.js"],
      b["Accessibility/HighContrastMode.js"],
      b["Accessibility/HighContrastTheme.js"],
      b["Accessibility/Options/Options.js"],
      b["Accessibility/Options/LangOptions.js"],
      b["Accessibility/Options/DeprecatedOptions.js"],
      b["Accessibility/Utils/HTMLUtilities.js"],
    ],
    function (
      b,
      e,
      r,
      p,
      u,
      t,
      l,
      m,
      h,
      q,
      g,
      a,
      c,
      d,
      f,
      n,
      v,
      C,
      N,
      J,
      H,
      F,
      B
    ) {
      function w(a) {
        this.init(a);
      }
      var y = r.doc,
        x = m.addEvent,
        z = m.extend,
        E = m.fireEvent,
        M = m.merge;
      M(!0, u.defaultOptions, J, {
        accessibility: { highContrastTheme: N },
        lang: H,
      });
      r.A11yChartUtilities = e;
      r.A11yHTMLUtilities = B;
      r.KeyboardNavigationHandler = p;
      r.AccessibilityComponent = h;
      w.prototype = {
        init: function (a) {
          this.chart = a;
          y.addEventListener && a.renderer.isSVG
            ? (F(a),
              this.initComponents(),
              (this.keyboardNavigation = new q(a, this.components)),
              this.update())
            : a.renderTo.setAttribute("aria-hidden", !0);
        },
        initComponents: function () {
          var b = this.chart,
            e = b.options.accessibility;
          this.components = {
            container: new v(),
            infoRegions: new n(),
            legend: new g(),
            chartMenu: new a(),
            rangeSelector: new f(),
            series: new c(),
            zoom: new d(),
          };
          e.customComponents && z(this.components, e.customComponents);
          var h = this.components;
          this.getComponentOrder().forEach(function (a) {
            h[a].initBase(b);
            h[a].init();
          });
        },
        getComponentOrder: function () {
          if (!this.components) return [];
          if (!this.components.series) return Object.keys(this.components);
          var a = Object.keys(this.components).filter(function (a) {
            return "series" !== a;
          });
          return ["series"].concat(a);
        },
        update: function () {
          var a = this.components,
            b = this.chart,
            c = b.options.accessibility;
          E(b, "beforeA11yUpdate");
          b.types = this.getChartTypes();
          this.getComponentOrder().forEach(function (c) {
            a[c].onChartUpdate();
            E(b, "afterA11yComponentUpdate", { name: c, component: a[c] });
          });
          this.keyboardNavigation.update(c.keyboardNavigation.order);
          !b.highContrastModeActive &&
            C.isHighContrastModeActive() &&
            C.setHighContrastTheme(b);
          E(b, "afterA11yUpdate", { accessibility: this });
        },
        destroy: function () {
          var a = this.chart || {},
            b = this.components;
          Object.keys(b).forEach(function (a) {
            b[a].destroy();
            b[a].destroyBase();
          });
          this.keyboardNavigation && this.keyboardNavigation.destroy();
          a.renderTo && a.renderTo.setAttribute("aria-hidden", !0);
          a.focusElement && a.focusElement.removeFocusBorder();
        },
        getChartTypes: function () {
          var a = {};
          this.chart.series.forEach(function (b) {
            a[b.type] = 1;
          });
          return Object.keys(a);
        },
      };
      b.prototype.updateA11yEnabled = function () {
        var a = this.accessibility,
          b = this.options.accessibility;
        b && b.enabled
          ? a
            ? a.update()
            : (this.accessibility = new w(this))
          : a
          ? (a.destroy && a.destroy(), delete this.accessibility)
          : this.renderTo.setAttribute("aria-hidden", !0);
      };
      x(b, "render", function (a) {
        this.a11yDirty &&
          this.renderTo &&
          (delete this.a11yDirty, this.updateA11yEnabled());
        var b = this.accessibility;
        b &&
          b.getComponentOrder().forEach(function (a) {
            b.components[a].onChartRender();
          });
      });
      x(b, "update", function (a) {
        if ((a = a.options.accessibility))
          a.customComponents &&
            ((this.options.accessibility.customComponents = a.customComponents),
            delete a.customComponents),
            M(!0, this.options.accessibility, a),
            this.accessibility &&
              this.accessibility.destroy &&
              (this.accessibility.destroy(), delete this.accessibility);
        this.a11yDirty = !0;
      });
      x(t, "update", function () {
        this.series.chart.accessibility && (this.series.chart.a11yDirty = !0);
      });
      ["addSeries", "init"].forEach(function (a) {
        x(b, a, function () {
          this.a11yDirty = !0;
        });
      });
      ["update", "updatedData", "remove"].forEach(function (a) {
        x(l, a, function () {
          this.chart.accessibility && (this.chart.a11yDirty = !0);
        });
      });
      ["afterDrilldown", "drillupall"].forEach(function (a) {
        x(b, a, function () {
          this.accessibility && this.accessibility.update();
        });
      });
      x(b, "destroy", function () {
        this.accessibility && this.accessibility.destroy();
      });
    }
  );
  v(b, "masters/modules/accessibility.src.js", [], function () {});
});
//# sourceMappingURL=accessibility.js.map
