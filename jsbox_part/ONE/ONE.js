// set cache
async function setToken() {
  const oneURL = "http://m.wufazhuce.com/one";
  let resp = await $http.get(oneURL);
  let token = resp.data
    .match(/One.token = '.*'/)[0]
    .split(" = ")[1]
    .replaceAll("'", "");
  $cache.set("token", token);
}
if (!$cache.get("logoImgCache")) {
  const logURL = "http://image.wufazhuce.com/icon_4.0.png";
  $cache.set("logoImgCache", $image(logURL));
}
if (!$cache.get("token")) {
  await setToken();
}
const apiURL =
  "http://m.wufazhuce.com/one/ajaxlist/0?_token=" + $cache.get("token");
let todayResp = await $http.get(apiURL);
// token invalid
if (todayResp.data.res != 0) {
  await setToken();
}
let todayData = todayResp.data.data[0];
let logoView = {
  type: "image",
  props: {
    frame: {
      width: 20,
      height: 20,
    },
    position: $point(25, 25),
    image: $cache.get("logoImgCache"),
    resizable: true,
  },
};
$widget.setTimeline({
  policy: {
    afterDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 1,
      0,
      0,
      0,
      0
    ),
  },
  render: (ctx) => {
    if (ctx.family == 2) {
      return {
        type: "vstack",
        views: [
          {
            type: "zstack",
            props: {
              frame: {
                height: 245,
              },
            },
            views: [
              {
                type: "image",
                props: {
                  image: $image(todayData.img_url),
                  resizable: true,
                },
              },
              logoView,
            ],
          },
          {
            type: "text",
            props: {
              frame: {
                maxWidth: Infinity,
                maxHeight: Infinity,
              },
              padding: $insets(5, 14, 5, 14),
              text: todayData.content,
              font: $font(14),
              color: $color("#6e7c7c"),
              minimumScaleFactor: 0.5,
            },
          },
          {
            type: "text",
            props: {
              frame: {
                maxWidth: Infinity,
                alignment: $widget.alignment.trailing,
              },
              padding: $insets(0, 0, 14, 14),
              text: "From：" + todayData.text_authors,
              font: $font(12),
              color: $color("#92967d"),
              minimumScaleFactor: 0.5,
            },
          },
        ],
      };
    } else {
      return {
        type: "text",
        props: {
          text: "only support big widget!",
        },
      };
    }
  },
});
