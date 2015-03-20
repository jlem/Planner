<?php $this->render('app/Views/header.php'); ?>
<div class="panel" id="left">
    <form action="/save" method="POST">
        <textarea name="notes" rows="60" cols="120"></textarea>
        <input name="submit" value="Submit" type="submit" />
    </form>
</div>
<div class="panel" id="preview"></div>
<?php $this->render('app/Views/footer.php'); ?>
