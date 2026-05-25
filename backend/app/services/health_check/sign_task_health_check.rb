class HealthCheck::SignTaskHealthCheck < ServiceCaller

  CHECK_PASS = 'ok'
  CHECK_SKIP = 'skip'
  CHECK_FAIL = 'failed'

  def initialize(task)
    @task = task
    self.class.prepend("HealthCheck::SignTaskHealthCheck::#{@task.status.camelize}".safe_constantize)
  end

  def call
    init_health_report
    status_check
    external_file_check

    @result = @health_report
  end

  def healthy?
    !@health_report.values.any?(CHECK_FAIL)
  end

  protected

  def init_health_report
    @health_report = {}
    check_items.each do |check_item|
      @health_report[check_item] = CHECK_FAIL
    end
  end

  def check_items
    []
  end

  def status_check
  end

  def external_file_check
  end

end
