$(function() {
  var htmlDecode = function(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }

  var makeEvent = function(e) {
    if (e === undefined) {
      return e;
    }

    var container = $("<div>", {
      class: "community--events--card columns medium-5"
    });
    var heading = $("<div>", {
      class: "community--events--card-heading heading a"
    });
    var ul = $("<ul>", {
      class: "no-bullet"
    });

    var eventType;

    if (e["event_category"]) {
      var parts = e["event_category"].split(",");
      var index = parts.indexOf("Habitat");

      if (index >= 0) {
        parts.splice(index, 1);
      }

      eventType = parts[0];
    } else {
      eventType = "Conference";
    }

    if (e["event_name"].match(/meetup/i)) {
      eventType = "Meetup";
    } else {
      eventType = "Conference";
    }

    var li = $("<li>").append(document.createTextNode(eventType));
    ul.append(li);
    heading.append(ul);
    container.append(heading);

    var body = $("<div>", {
      class: "body-content"
    });
    var a = $("<a>", {
      class: "h4",
      href: htmlDecode(e["guid"])
    }).append(document.createTextNode(e["event_name"]));
    var p = $("<p>");
    var postContent = "<div>" + e["post_content"] + "</div>";
    var pc = $(postContent).text();
    p.append(pc);
    var meta = $("<div>", {
      class: "article-detail--meta"
    });
    var ul2 = $("<ul>", {
      class: "no-bullet"
    });
    var li2 = $("<li>");
    var calendar = $("<img>", {
      alt: "calendar icon",
      onerror: "this.src='/images/icons/icon-calendar.png'",
      src: "/images/icons/icon-calendar.svg"
    });
    var url = "https://events.chef.io/events/s/category/habitat/?scope[0]=" + e["start_date"] + "&scope[1]=" + e["start_date"];
    var a2 = $("<a>", {
      href: encodeURI(url)
    }).append(document.createTextNode(e["start_date"]));

    li2.append(calendar);
    li2.append(a2);

    var li3 = $("<li>");
    var img = $("<img>", {
      alt: "map pin icon",
      onerror: "this.src='/images/icons/icon-pin.png'",
      src: "/images/icons/icon-pin.svg"
    });

    var eventLocation = "";

    if (e["event_location"] && e["event_location"]["city"] && e["event_location"]["country"]) {
      eventLocation = e["event_location"]["city"] + ", " + e["event_location"]["country"];
    }

    li3.append(img);
    li3.append(document.createTextNode(eventLocation));
    ul2.append(li2);
    ul2.append(li3);
    meta.append(ul2);

    body.append(a);
    body.append(p);
    body.append(meta);

    container.append(body);

    return container;
  }

  if ($(".community--events--content")) {
    $.getJSON("https://events.chef.io/wp-json/events/category/habitat", function(data) {
      if (Array.isArray(data)) {
        for (var i=0; i < data.length; i+=2) {
          var row = $("<div>", {
            class: "row"
          });

          var first = makeEvent(data[i]);
          var second = makeEvent(data[i+1]);

          row.append(first);
          if (second) {
            row.append(second);
          }

          $("div.community--events--content").append(row);
        }
      }
    });
  }
});
