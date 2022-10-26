import { ActionPanel, Detail, List, Action, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { Client } from "@notionhq/client";
import { nextSaturday, previousSunday, startOfToday, startOfTomorrow } from "date-fns";

const notion = new Client({
  auth: "",
});

const ToDoList = () => {
  const [todos, setTodos] = useState();

  useEffect(() => {
    const getTasks = async () =>
      await notion.databases
        .query({
          database_id: "9e473068cf90464293b9758cb487f4d1",
          filter: {
            and: [
              { property: "Status", status: { does_not_equal: "Complete" } },
              { property: "Status", status: { does_not_equal: "Abandoned" } },
              { property: "Due Date", date: { on_or_before: new Date() } },
            ],
          },
        })
        .then((response) => setTodos(response.results));

    getTasks();
  }, []);

  return (
    <List>
      {todos &&
        todos.map((todo) => {
          const title = todo.properties.Name.title[0]?.plain_text;
          return (
            <List.Item
              icon=""
              title={title || "Untitled"}
              actions={
                <ActionPanel>
                  <ActionPanel.Submenu title="Edit Status">
                    <Action
                      title="Complete"
                      onAction={() => showToast({ style: Toast.Style.Animated, title: "Updating Property" })}
                    ></Action>
                  </ActionPanel.Submenu>
                </ActionPanel>
              }
            />
          );
        })}
    </List>
  );
};

export default ToDoList;

//ttps://rlplanner.notion.site/9e473068cf90464293b9758cb487f4d1?v=c2a19e06564c4d42bcb855bd6a388824
