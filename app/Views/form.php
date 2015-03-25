<?php $this->render('app/Views/header.php'); ?>
<div class="panel" id="left">
    <textarea name="notes" rows="50" cols="100"></textarea>
    <input name="submit" value="Submit" type="submit" />
    <label style="color : red">Saved!</label>
</div>
<div class="panel" id="preview"></div>
<?php $this->render('app/Views/footer.php'); ?>
