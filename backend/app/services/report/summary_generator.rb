require 'csv'

module Report
  class SummaryGenerator < ServiceCaller

    def initialize(group_id, member_ids, time_range, time_zone, export: false)
      @group_id = group_id
      @member_ids = member_ids
      @time_range = time_range
      @time_zone = time_zone
      @export = export
    end

    def call
      get_member_ids
      get_summary
      if @export
        generate_csv
        @result = @csv_string
      else
        process_summary
        @result = @summary
      end
    end

    private

    def get_member_ids
      return if @member_ids.present?
      @member_ids ||= SignTask.where(group_id: @group_id).pluck(:owner_id).uniq
    end

    def get_summary
      @summary = SignTask.summary(@group_id, @member_ids, @time_range, @time_zone)
    end

    def process_summary
      @summary[:sent_trend] = summary_hash_to_array(@summary[:sent_trend])
      @summary[:completed_trend] = summary_hash_to_array(@summary[:completed_trend])
    end

    def generate_csv
      @csv_string = CSV.generate do |csv|
        csv << csv_headers
        date_range.each do |date|
          csv << [date, @summary[:sent_trend][date] || 0, @summary[:completed_trend][date] || 0]
        end
      end
    end

    def csv_headers
      ['Date', 'Created Tasks', 'Completed Tasks']
    end

    def summary_hash_to_array(hash)
      date_range.map do |date|
        {date: date, count: hash[date] || 0}
      end
    end

    def date_range
      return @date_range if @date_range.present?
      start_date = Date.parse(@time_range.first.strftime('%Y%m%d'))
      end_date = Date.parse(@time_range.last.strftime('%Y%m%d'))
      @date_range = (start_date..end_date).map(&:to_s)
    end

  end
end
