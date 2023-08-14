import { test, expect } from '@playwright/test';

const url = 'http://localhost:5000'

test('should not return OK for empty input', async ({ request }) => {
    
    const response = await request.post(url + "/register", {
        data: {}
    });
    
    expect(response.ok()).toBeFalsy();
});

test('should not return 200 OK for invalid input', async ({ request }) => {
    
    const response = await request.post(url + "/register", {
        data: {
            did: 'invalid did', 
            firstName: '', 
            lastName: '', 
            expDate: '', 
            location: '', 
            municipality: '', 
            alcoGroup: '' 
        }
    });
    
    expect(response.ok()).toBeFalsy();
});

test('should register credential for correct input', async ({ request }) => {
    const data =  {
        did:"did:digdir:0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
        firstName:"Emil",
        lastName:"Ovesen",
        expDate:"17-12-2023",
        location:"Langtvekkistan",
        municipality:"Brønnøysund",
        alcoGroup:"Mega"
    }
    const response = await request.post(url + "/register", {
        data: data
    });
    
    expect(response.ok()).toBeTruthy();
    // TODO: Confirm registration
});
  