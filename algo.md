# Algorithm for Route Optimization

1. **Fetch Requests**
   - Retrieve requests starting from 20:00 of the current day and everything after 20:00 yesterday.

2. **Initialize Route Weight**
   - Create a route weight variable to prioritize requests based on defined parameters.

3. **Sort by Time Window**
   - Group requests by time window using the `timeWindow` function.

4. **Sort by First-Come, First-Serve**
   - Order requests within each time window by the time they were submitted.

5. **Sort by Location**
   - Use latitude and longitude coordinates to organize requests by geographical proximity.

6. **Optimize with Google API**
   - Use the Google Maps API to calculate the best route for the requests.

7. **Apply Sorting Logic**
   - Use a simple sorting equation to optimize the order further.

8. **Adjust Route Weights**
   - Recalculate the weight of each route:
     - Add +1 for higher priority.
     - Assign the slowest request in the time window to the next window with -1 weight.

9. **Recheck Routes**
   - Verify the calculated routes using the API to ensure accuracy and efficiency.

10. **Determine the Most Efficient Route**
    - Select the route with the highest optimization score for execution.

11. **Handle Special Cases**
    - Ensure edge cases (e.g., if `a` is for route `z`) are handled appropriately

so we also need a function for only two or three per time slot? time slot alocation needs to block aftwrr that
3 time slots per day 20:00 - 20:00 or should we have an extra ?