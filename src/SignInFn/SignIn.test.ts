jest.mock('../Global/Cognito');

import cogClient from '../Global/Cognito';
import createEvent from '@serverless/event-mocks';
import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from './SignIn'

jest.mock('../Global/Cognito');

describe('SignIn function handler', () => {
    
    it('should fail with code 400 when provided with invalid body', async () => {
        const input = createEvent("aws:apiGateway", {} as APIGatewayProxyEvent);

        const result = await handler(input);

        expect(result.statusCode).toBe(400);
    });

    it('should fail with code 400 when cognito fails', async () => {
        const inputBody = JSON.stringify({
            userName: "bob",
            password: "password"
        });
        const input = createEvent("aws:apiGateway", {body: inputBody});
        cogClient.send.mockImplementationOnce(() => {
            throw 'There was an error';
        });

        const result = await handler(input)

        expect(result.statusCode).toBe(400);
    });

    it("should succeed with code 200 when correct body is provided and cognito doesn't error", async () => {
        const inputBody = JSON.stringify({
            userName: "bob",
            password: "password"
        });
        const input = createEvent("aws:apiGateway", {body: inputBody});
        cogClient.send.mockImplementationOnce(async () => {
            return {};
        });

        const result = await handler(input)

        expect(result.statusCode).toBe(200);
    });

});