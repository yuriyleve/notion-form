const convertFormToNotion = (formData) => {
  let result = formData.reduce((obj, item) => {
    let key = item.label;
    let type = item.name.split("_")[0];

    switch (type) {
      case "checkbox":
        obj[key] = {
          checkbox: item.value[0] ? true : false,
        };
        break;
      case "status":
        obj[key] = {
          status: { name: item.value },
        };
        break;
      case "file":
        obj[key] = {
          files: [
            {
              type: "external",
              name: key,
              external: {
                url: item.value,
              },
            },
          ],
        };
        break;
      case "camera":
        obj[key] = {
          files: [
            {
              type: "external",
              name: key,
              external: {
                url: item.value,
              },
            },
          ],
        };
        break;
      case "range":
        obj[key] = {
          number: item.value,
        };
        break;
      case "phone":
        if (item.value) {
          obj[key] = {
            phone_number: item.value,
          };
        }
        break;
      case "number":
        obj[key] = {
          number: Number(item.value),
        };
        break;
      case "rating":
        obj[key] = {
          number: item.value,
        };
        break;
      case "signature":
        if (item.value) {
          obj[key] = {
            signature: item.value,
          };
        }
        break;
      case "dropdown":
        obj[key] = {
          select: { name: item.value[0] },
        };
        break;
      case "checkboxes":
        let options = item.value.map((obj) => {
          return { name: obj };
        });

        obj[key] = {
          multi_select: options,
        };
        break;
      case "text":
        if (key === "Name") {
          obj[key] = {
            title: [
              {
                text: {
                  content: item.value,
                },
              },
            ],
          };
        } else {
          obj[key] = {
            rich_text: [
              {
                text: {
                  content: item.value,
                },
              },
            ],
          };
        }
        break;
      case "radiobuttons":
        if (item.value[0]) {
          obj[key] = {
            rich_text: [
              {
                text: {
                  content: item.value[0],
                },
              },
            ],
          };
        }
        break;
      case "date":
        const param = item.value ? item.value : "";
        const date = new Date(param);
        const isoDate = date.toISOString();

        obj[key] = {
          date: {
            start: isoDate,
          },
        };
        break;
      case "email":
        if (item.value) {
          obj[key] = {
            [type]: item.value,
          };
        }
        break;

      default:
        obj[key] = {
          [type]: item.value,
        };
        break;
    }

    return obj;
  }, {});
  return result;
};

module.exports = convertFormToNotion;
