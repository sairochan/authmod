          <select class="form-control" id="predefined_type">
            <% for (let i = 0; i < results.length; i++){ %>
              <option><%= results[i].type %></option>
            <% } %>
          </select>
        </div>
        <div class="form-group" styleding:20px;">
          <label for="predefined_value">Enter predefined_value</label>
          <select class="form-control" id="predefined_value">
            <% for (let i = 0; i < results.length; i++){ %>
              <option><%= results[i].type %></option>
            <% } %>
          </select>      

          con.query(`select type from predefined`, [], function (error, results, fields) {
            if (error) throw error; 
            
            });


        <!-- <div class="form-group" style="padding:20px;">
          <label for="user_role">Enter Role</label>
          <select class="form-control" id="user_role">
            <% for (let i = 0; i < data1.length; i++){ %>
              <option><%= data1[i].type_value %></option>
            <% } %>
          </select>
        </div>
        <div class="form-group" style="padding:20px;">
          <label for="school_name">Enter school name</label>
          <select class="form-control" id="school_name">
            <% for (let i = 0; i < data1.length; i++){ %>
              <option><%= data1[i].type_value %></option>
            <% } %>
          </select>
        </div> -->

