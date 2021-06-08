import { gql, InMemoryCache, useMutation } from "@apollo/client";
import ApolloClient from "apollo-boost";
import { Form, Input, Button, Checkbox, Table } from "antd";
import { useEffect, useState } from "react";

export const createLesson = gql`
  mutation createLesson($createLessonInput: CreateLessonInput!) {
    createLesson(createLessonInput: $createLessonInput) {
      name
      startDate
      endDate
    }
  }
`;
const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
});
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "StartDate",
    dataIndex: "startDate",
    key: "startDate",
  },
];

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default function Home({ data }) {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    setLessons(data.lessons);
  }, []);

  const onFinish = async (values) => {
    const newObj = {
      name: values.name,
      startDate: new Date().toISOString(), //
      endDate: new Date().toISOString(), //
    };

    try {
      await client.mutate({
        mutation: createLesson,
        variables: {
          createLessonInput: newObj,
        },
      });
      setLessons([...lessons, newObj]);
    } catch (e) {
      console.log(JSON.stringify(e, null, 2));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Form {...layout} name="basic" onFinish={onFinish}>
        <Form.Item
          label="name"
          name="name"
          rules={[{ required: true, message: "Please input your Name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Table dataSource={lessons} columns={columns} />
    </div>
  );
}

export async function getStaticProps() {
  const { data } = await client.query({
    query: gql`
      query GetLessons {
        lessons {
          id
          name
          startDate
          endDate
        }
      }
    `,
  });
  return {
    props: {
      data: data,
    },
  };
}
