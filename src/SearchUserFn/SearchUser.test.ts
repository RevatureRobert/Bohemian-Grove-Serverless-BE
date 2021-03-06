import { ddbDocClient } from '../Global/DynamoDB'
import { PutCommand, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { testUser1, testUser2, testUser3, testUser4 } from '../Global/TestData'
import { handler } from './SearchUser'
import { HTTPResponse } from '../Global/DTO';
import lambdaEventMock from "lambda-event-mock"

afterAll(() => {
    ddbDocClient.destroy();
});

test('it should return the users from the search params', async () => {
    const putParams1 = {
        TableName: process.env.DDB_TABLE_NAME,
        Item: testUser1
    }
    const putParams2 = {
        TableName: process.env.DDB_TABLE_NAME,
        Item: testUser2
    }
    const putParams3 = {
        TableName: process.env.DDB_TABLE_NAME,
        Item: testUser3
    }

    await ddbDocClient.send(new PutCommand(putParams1));
    await ddbDocClient.send(new PutCommand(putParams2));
    await ddbDocClient.send(new PutCommand(putParams3));

    const mockEvent = lambdaEventMock.apiGateway()
        .path(`/user/search`)
        .method('GET')
        .header('test user search')

    mockEvent._event.pathParameters = testUser1.displayName
    const result = await handler(mockEvent._event);

    const checker = new HTTPResponse(200, [testUser1])


    expect(result.statusCode).toEqual(checker.statusCode);
})


test('if path params is null it should return a 400 status code saying path params was null', async () => {


    const mockEvent = lambdaEventMock.apiGateway()
        .path(`/user/search`)
        .method('GET')



    const result = await handler(mockEvent._event);

    expect(result.statusCode).toEqual(400);
    expect(result.body).toBe('["path params was null"]')

})